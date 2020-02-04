
// $(window).load(function(){   
(async function($){

	// enable / disable logging 
	// to enable console.log, set localStorage.debugLOG = true in chrome dev console.
	const debugLog = {}
	const ignore = () => {};
	debugLog.log = (msg) => {
		if(localStorage.getItem('debugLOG') === 'true') {
		  	window.console.log(msg);
			return
		}
		ignore(msg);
	}

	// initialize constant from chrome.storage.local API
	const LOCAL_STORAGE_KEY = 'MBK_SEARCH_OPTIONS';
	const DEFAULT_CONSTANTS = {
		address : 'http://10.10.16.122:3000',
		maxResult : 100,
		minWord : 2
	};
	const CONSTANTS = await getLocalStorage(LOCAL_STORAGE_KEY) || DEFAULT_CONSTANTS;
	console.log(CONSTANTS);


	
	// max display records
	// const MAX_RECORD = 500; // need get from local storage

	// draw UI and get autocomplete input element
    const searchInput = makeUI();
	 
    // implement draggable   
	const drag = getDrag();
	drag.app.init();

	// start : main logic for autocomplete	
	const selector = searchInput;
	// const searchURL = 'http://10.10.16.122:3000';

	// dynamic update CONSTANTS value
	chrome.storage.onChanged.addListener((changes, namespace) => {
		// namespaces = local or sync ()
		// changes = {MBK_SEARCH_OPTIONS: {newValue:{}, oldValue:{}}
		console.log(changes);
		if(changes[LOCAL_STORAGE_KEY]){
			const {address, maxResult, minWord, delay, timeout} = changes[LOCAL_STORAGE_KEY].newValue;
			CONSTANTS.address = address;
			CONSTANTS.maxResult = maxResult;
			CONSTANTS.minWord = minWord;
			CONSTANTS.delay = delay;
			CONSTANTS.timeout = timeout;			
			console.log('CONSTANT changed : ', CONSTANTS)

			// dynamically change autocomplete delay value
			$(selector).autocomplete( "option", "delay", CONSTANTS.delay );
		}
	});

	let userId = null;

	$(selector).autocomplete({
		delay: CONSTANTS.delay,
		source: function(request,response){
			const timer = new Timer();
			timer.start();
			// remove empty space of string expecially on starting position
			var data = $(selector).val().replace(/^\s+/, ""); 
			// if data.length < CONSTANTS.minWord pass
			if(data.length < CONSTANTS.minWord){
				// response([{label:null, value:null, artistName:null, songName:null}]);
				response();
				timer.end();
				return;
			} 
			$('#titleDiv').text('검색중...');
			for ( var i = 0 ; i < data.length ; i++ ) {
				if(Hangul.isHangul(data[i])){
					debugLog.log('이건 초성검색이 아닙니다');
					break;
				}
				if(!Hangul.isHangul(data[i])){
					//초성만 입력되거나 문자가 영문 또는 'ㅗㅒ' 이런글자들이다.
					if(Hangul.isConsonant(data[i]) && !Hangul.isCho(data[i])){
					// 그리고 자음이면서, 초성으로 쓰일수 없는 글자라면... disassemble한다.
							var result = Hangul.disassemble(data).join('');
							debugLog.log(result);	
							$(selector).val(result);
					}
				}
			}
			try {
				userId = userId === null ? document.getElementById('topFrame').contentWindow.document.
										getElementById('topGnbWrap').lastElementChild.lastElementChild.
										children[0].innerText 
										: userId;
				console.log(userId);
			} catch(err) {
				console.log(err);
				userId = 'none';
			}

			$.ajax({
				// 'url':'/searchSong/withWorkers/'+encodeURIComponent(request.term),
				'url': CONSTANTS.address + '/searchSong/withWorkers/' + encodeURIComponent(request.term) + '?userId=' + userId,
				'type':'GET',
				'timeout': CONSTANTS.timeout,
				'success': function(res){
					const {result,count = 0} = res;
					const elapsed = timer.end();
					const elapsedToFixed = elapsed.toFixed ? elapsed.toFixed(3) : parseFloat(elapsed).toFixed(3);
					const countPerTotal = count > CONSTANTS.maxResult ? `${CONSTANTS.maxResult}/${count}` : `${count}/${count}`
					$('#titleDiv').text('결과건수 : '+ countPerTotal + ', 시간 : ' + elapsedToFixed + '초');
					// debugLog.log(result)
					try {
						if(!Array.isArray(result)) throw '서버오류';
						response(
							$.map(result.slice(0,CONSTANTS.maxResult), function(item){	
								return {
									label : item.artistName + ' ^ '+ item.songName,
									value : item.songName,
									artistName : item.artistName, 
									songName :  item.songName,
								};							
							})

						);		
					} catch (err) {
						$('#titleDiv').text(err);
						console.log(err);
						response();
					}	
				},
				'error': (xhrObj, errString, errStatus) => {
					console.log(errString);
					const stringMap = {
						'timeout' : '시간초과',
					}
					$('#titleDiv').text(stringMap[errString]);
					response();
				}	 	
				
			});
		},
		focus: function(event, ui){
			event.preventDefault();
		},
		select: function(event,ui){ // 값 선택할 때 input box에 값 채워지고 submit 되도록
			var promise = new Promise(function(resolve,reject){
				$('this').text = ui.item.value;
				resolve()
			})
			promise.then(function(result){
				// Althought input element is located in topLevel iframe,
				// "all_frame : true" option in manifest.json makes input element selectable.
				// but, after all_frame value is setted true, the content script can access that frame element only!

				// So, instead of using all_frame, elements in iframe can be accessed contents() api in jQuery	
				// like const selector = $('#topFrame').contents().find('#sch_search_text');
				$('#topFrame').contents().find('#sch_search_text').val(ui.item.songName);
				$('#topFrame').contents().find('#sch_search_text').next().trigger('click');
			});
		},
		// highlight matched string
		open: function (e, ui) {
			try {
				var acData = $(this).data('ui-autocomplete');
				acData
				.menu
				.element
				.find('li')
				.each(function () {
					var me = $(this);
					var keywords = acData.term.split(' ').join('|');
					me.html(me.text().replace(new RegExp("(" + keywords + ")", "gi"), '<b>$1</b>'));
				});
			} catch (err) {
				console.log(err);
			}		
		} 
	});	

	// start : utility functions (makeUI, getDrag etc...)

	function makeUI() {
		// apply jquery ui autocomplete style
		// define css using javascript
		const style = document.createElement('style');
		document.head.appendChild(style);
		const LOADING_IMG_URL = chrome.runtime.getURL('images/loading_16.gif');
		style.sheet.insertRule(`.ui-autocomplete-loading {background: white url(${LOADING_IMG_URL}) right center no-repeat;}`);
		style.sheet.insertRule('.ui-autocomplete.ui-widget {font-family: Verdana,Arial,sans-serif;font-size: 12px;}');
		style.sheet.insertRule('.ui-autocomplete {max-height: 500px; overflow-y: auto; overflow-x: hidden;')
		//
	
		// begin add UI
		// add container div in top document
		const containerDiv = document.createElement('div');
		containerDiv.setAttribute('id', 'container');
		containerDiv.setAttribute('style', 'font-size: small;position: fixed;top: 6px;left: 689px;display: flex;align-items:center');
		document.body.appendChild(containerDiv);
	
		// add content div in container
		const contentDiv = document.createElement('div');
		contentDiv.setAttribute('id', 'searchResult');
		contentDiv.setAttribute("style", "background-color: tomato;color: white;font-size: small;display:flex;flex-direction:column;");
		containerDiv.appendChild(contentDiv);
		
		// add title div in content
		const titleDiv = document.createElement('div');
		titleDiv.setAttribute('id', 'titleDiv');
		titleDiv.setAttribute("style","margin: 3px;margin-left: 5px;font-size: 5px;");
		titleDiv.innerText = '검색 자동완성';
		contentDiv.appendChild(titleDiv);
		// add search input in content
		const searchInput = document.createElement('input');
		searchInput.setAttribute('id', 'autoSearchInput');
		searchInput.setAttribute('type', 'text');
		searchInput.setAttribute('onClick', 'this.select();');
		searchInput.setAttribute('style', 'font-family: Verdana, Arial, sans-serif;font-size: 12px;')
		contentDiv.appendChild(searchInput);
	
		// add move div in container
		const moveDiv = document.createElement('div');
		moveDiv.setAttribute('id', 'containerMover');
		moveDiv.setAttribute('style', 'cursor: move;');
		containerDiv.appendChild(moveDiv);
	
		// add image tag in move div
		const imgTag = document.createElement('img');
		const imgURL = chrome.runtime.getURL('images/mouse-26.png');
		//imgTag.src = imgURL;
		imgTag.setAttribute('src', imgURL);
		imgTag.setAttribute('style', 'margin-left:5px');
		imgTag.setAttribute('id', 'autocompleteMover');
		imgTag.setAttribute('draggable', false);
		moveDiv.append(imgTag);
		// end of UI
	
		return searchInput;
	}

	function getDrag(){
		const drag = {};
		drag.app = {
			config: {
				canDrag: false,
				cursorOffsetX: 0,
				cursorOffsetY: 0,
				cursorOffsetXMover : 0,
				cursorOffsetYMover : 0,
				targetId: 'container',
				moverId: 'autocompleteMover'
			},
			reset: function () {
				this.config.canDrag = false;
				this.config.cursorOffsetX = 0;
				this.config.cursorOffsetY = 0;
			},
			logicDrag: function () {
				debugLog.log(this.config.canDrag);
				if (this.config.canDrag) {
					this.adjustPostion(event, this.config.targetId);
				} else {
					this.reset();
				}
			},
			init: function () {
	
				document.getElementById(this.config.moverId).addEventListener('mousedown', function (event) {
					debugLog.log(`bindIFrameMousemove`)
					bindIFrameMousemove(document.getElementById('topFrame'));
					bindIFrameMousemove(document.getElementById('centerFrame'));
				}.bind(this), {once:true});
	
				document.getElementById(this.config.moverId).addEventListener('mousedown', function (event) {
					debugLog.log(`+++++++++++++ mousedown : currentX : ${event.clientX}, currentY : ${event.clientY}`)
					bindIFrameMousemove(document.getElementById('centerFrame').contentWindow.document.getElementsByTagName('iframe')[0]);
					bindIFrameMousemove(document.getElementById('centerFrame').contentWindow.document.getElementsByTagName('iframe')[1]);
					this.config.canDrag = true;
					this.config.cursorOffsetXMover = event.clientX;
					this.config.cursorOffsetYMover = event.clientY;
	
				}.bind(this));
				document.addEventListener('mousemove', function (event) {
					// debugLog.log('+ mousemove')
					this.logicDrag();
				}.bind(this));
				document.addEventListener('mousedown', function (event) {
					debugLog.log('---- mousedown')
				}.bind(this));
				document.getElementById(this.config.moverId).addEventListener('mouseout', function (event) {
					debugLog.log('+++ mouseout')
					this.logicDrag();
				}.bind(this));
				document.getElementById(this.config.moverId).addEventListener('mouseleave', function (event) {
					debugLog.log('+++ mouseleave');
					this.logicDrag();
				}.bind(this));
				document.getElementById(this.config.moverId).addEventListener('mouseenter', function (event) {
					debugLog.log('+++ mouseenter');
				}.bind(this));
				document.getElementById(this.config.moverId).addEventListener('mouseup', function (event) {
					debugLog.log('+++++++++++++ mouseup')
					this.reset();
				}.bind(this));
			},
			adjustPostion: function (event, targetId) {
				debugLog.log(`+++++++++++++ adjustPosition : clientX : ${event.clientX}, clientY : ${event.clientY}`)
				debugLog.log(`+++++++++++++ adjustPosition : cursorOffsetX : ${this.config.cursorOffsetY}, cursorOffsetX : ${this.config.cursorOffsetY}`)
				debugLog.log(`+++++++++++++ adjustPosition : cursorOffsetXMover : ${this.config.cursorOffsetXMover}, cursorOffsetYMover : ${this.config.cursorOffsetYMover}`)
				// calculate the new cursor position
				this.config.cursorOffsetX = this.config.cursorOffsetXMover - event.clientX;
				this.config.cursorOffsetY = this.config.cursorOffsetYMover - event.clientY;
				this.config.cursorOffsetXMover = event.clientX;
				this.config.cursorOffsetYMover = event.clientY;
	
				var elm = document.getElementById(targetId);
				// elm.style.left = (event.pageX - this.config.cursorOffsetX) + 'px';
				// elm.style.top = (event.pageY - this.config.cursorOffsetY) + 'px';
				elm.style.top = (elm.offsetTop - this.config.cursorOffsetY) + 'px';     
				elm.style.left = (elm.offsetLeft - this.config.cursorOffsetX) + 'px';
		   
			}
	
		};
		return drag;
	}

	// to enhance movement when dragging elements, mousemove events should be fired in iframe
	function bindIFrameMousemove(iframe){
		iframe.contentWindow.addEventListener('mousemove', function(event) {
			var clRect = iframe.getBoundingClientRect();
			var evt = new CustomEvent('mousemove', {bubbles: true, cancelable: false});
	
			evt.clientX = event.clientX + clRect.left;
			evt.clientY = event.clientY + clRect.top;
	
			iframe.dispatchEvent(evt);
		});
	};

})(jQuery);

// get localStorage function
function getLocalStorage(key) {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.get(key, results => {
				if(results) {
					resolve(results[key]);
					return
				}
				resolve(null);
			})
		} catch (err){
			console.log(err);
			reject(err);
		}
	})
}

// define Timer class definition	
class Timer {
	constructor(){
		this.startTime = null;
		this.endTime = null;
		this.runnig = null;
	}
	start = () => {
		if(this.running) {
				console.log('timer already started');
				return false;
		}
		const time = new Date();
		this.startTime = time.getTime();
		this.running = true;
	}
	getDuration = () => {
		return ((this.endTime - this.startTime ) / 1000).toFixed(5);
	}
	end = () => {
		if(!this.running) {
			console.log('start timer first!');
			return false;
		}
		const time = new Date();
		this.endTime = time.getTime();
		this.running = false;
		return this.getDuration();
	}
}