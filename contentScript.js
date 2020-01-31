
// $(window).load(function(){   
(function($){

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

	// Althought input element is located in topLevel iframe,
	// "all_frame : true" option in manifest.json makes input element selectable.
	// but, after all_frame value is setted true, the content script can access that frame element only!

	// So, instead of using all_frame, elements in iframe can be accessed contents() api in jQuery	
	// like const selector = $('#topFrame').contents().find('#sch_search_text');

	const MAX_RECORD = 500; // need get from local storage

	// define css using javascript
	const style = document.createElement('style');
	document.head.appendChild(style);
	// const LOADING_IMG_URL = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/images/ui-anim_basic_16x16.gif';
	const LOADING_IMG_URL = chrome.runtime.getURL('images/loading_16.gif');
	style.sheet.insertRule(`.ui-autocomplete-loading {background: white url(${LOADING_IMG_URL}) right center no-repeat;}`);
	style.sheet.insertRule('.ui-autocomplete.ui-widget {font-family: Verdana,Arial,sans-serif;font-size: 12px;}');
	style.sheet.insertRule('.ui-autocomplete {max-height: 500px; overflow-y: auto; overflow-x: hidden;')
	//

	const containerDiv = document.createElement('div');
	containerDiv.setAttribute('id', 'container');
	containerDiv.setAttribute('style', 'font-size: small;position: fixed;top: 6px;left: 689px;display: flex;align-items:center');
	document.body.appendChild(containerDiv);

	const contentDiv = document.createElement('div');
	contentDiv.setAttribute('id', 'searchResult');
	contentDiv.setAttribute("style", "background-color: black;color: white;font-size: small;display:flex;flex-direction:column;");
	containerDiv.appendChild(contentDiv);
	
	const titleDiv = document.createElement('div');
	titleDiv.setAttribute('id', 'titleDiv');
	titleDiv.setAttribute("style","margin: 3px;margin-left: 5px;font-size: 5px;");
	titleDiv.innerText = '검색 자동완성';
	contentDiv.appendChild(titleDiv);
	const searchInput = document.createElement('input');
	searchInput.setAttribute('id', 'autoSearchInput');
	searchInput.setAttribute('type', 'text');
	searchInput.setAttribute('onClick', 'this.select();');
	contentDiv.appendChild(searchInput);

	const moveDiv = document.createElement('div');
	moveDiv.setAttribute('id', 'containerMover');
	moveDiv.setAttribute('style', 'cursor: move;');
	containerDiv.appendChild(moveDiv);

	const imgTag = document.createElement('img');
	const imgURL = chrome.runtime.getURL('images/mouse-26.png');
	//imgTag.src = imgURL;
	imgTag.setAttribute('src', imgURL);
	imgTag.setAttribute('style', 'margin-left:5px');
	imgTag.setAttribute('id', 'autocompleteMover');
	imgTag.setAttribute('draggable', false);
	moveDiv.append(imgTag);
	 
	// const selector = '#sch_search_text';
	// const selector = $('#topFrame').contents().find('#sch_search_text');
	const selector = searchInput;
	const searchURL = 'http://10.10.16.122:3000';

	// make input element draggable
	// https://stackoverflow.com/questions/3895552/jquery-draggable-input-elements

	// $(".draggable").draggable({
	// 	start: function (event, ui) {
	// 		$(this).data('preventBehaviour', true);
	// 	}
	// });
	// $(".draggable").find(":input").on('mousedown', function (e) {
	// 	var mdown = new MouseEvent("mousedown", {
	// 		screenX: e.screenX,
	// 		screenY: e.screenY,
	// 		clientX: e.clientX,
	// 		clientY: e.clientY,
	// 		view: window
	// 	});
	// 	$(this).closest('.draggable')[0].dispatchEvent(mdown);
	// }).on('click', function (e) {
	// 	var $draggable = $(this).closest('.draggable');
	// 	if ($draggable.data("preventBehaviour")) {
	// 		e.preventDefault();
	// 		$draggable.data("preventBehaviour", false)
	// 	}
	// });

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
		start: function () {

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

	drag.app.start();

	// https://www.w3schools.com/howto/howto_js_draggable.asp

	// dragElement(document.getElementById("container"));
	// function dragElement(elmnt) {
	// 	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	// 	if (document.getElementById(elmnt.id + "Mover")) {
	// 		// if present, the header is where you move the DIV from:
	// 		document.getElementById(elmnt.id + "Mover").onmousedown = dragMouseDown;
	// 	} else {
	// 		// otherwise, move the DIV from anywhere inside the DIV:
	// 		elmnt.onmousedown = dragMouseDown;
	// 	}

	// 	function dragMouseDown(e) {
	// 		e = e || window.event;
	// 		e.preventDefault();
	// 		// get the mouse cursor position at startup:
	// 		pos3 = e.clientX;
	// 		pos4 = e.clientY;
	// 		document.onmouseup = closeDragElement;
	// 		// call a function whenever the cursor moves:
	// 		document.onmousemove = elementDrag;
	// 	}

	// 	function elementDrag(e) {
	// 		e = e || window.event;
	// 		e.preventDefault();
	// 		// calculate the new cursor position:
	// 		pos1 = pos3 - e.clientX;
	// 		pos2 = pos4 - e.clientY;
	// 		pos3 = e.clientX;
	// 		pos4 = e.clientY;
	// 		// set the element's new position:
	// 		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	// 		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	// 	}

	// 	function closeDragElement() {
	// 		// stop moving when mouse button is released:
	// 		document.onmouseup = null;
	// 		document.onmousemove = null;
	// 	}
	// }

	$(selector).autocomplete({
		source: function(request,response){
			const timer = new Timer();
			timer.start();
			var data = $(selector).val(); 
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
			
			$.ajax({
				// 'url':'/searchSong/withWorkers/'+encodeURIComponent(request.term),
				'url': searchURL + '/searchSong/withWorkers/' + encodeURIComponent(request.term),
				'type':'GET',
				'success':function(res){
					const {result,count} = res;
					const elapsed = timer.end();
					$('#titleDiv').text('결과 : '+ count + '건, 시간 : ' + elapsed + '초');
					// debugLog.log(result)
					try {
						response(
							// $.map(result.slice(0,20),function(item){
							$.map(result.slice(0,MAX_RECORD), function(item){	
								return {
									label : item.artistName + ' : '+ item.songName,
									value : item.songName,
									artistName : item.artistName, 
									songName :  item.songName,
								};							
							})

						);		
					} catch (err) {
						console.error(err);
						response([{label:null, value:null, artistName:null, songName:null}]);
					}	
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
				console.error(err);
			}		
		} 
	});	
})(jQuery);
	
class Timer {
	constructor(){
		this.startTime = null;
		this.endTime = null;
		this.runnig = null;
	}
	start = () => {
		if(this.running) {
				console.error('timer already started');
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
			console.error('start timer first!');
			return false;
		}
		const time = new Date();
		this.endTime = time.getTime();
		this.running = false;
		return this.getDuration();
	}
}