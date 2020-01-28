
$(window).load(function(){   

	// Althought input element is located in topLevel iframe,
	// "all_frame : true" option in manifest.json makes input element selectable.
	// but, after all_frame value is setted true, the content script can access that frame element only!

	// So, instead of using all_frame, elements in iframe can be accessed contents() api in jQuery	
	// like const selector = $('#topFrame').contents().find('#sch_search_text');

	const MAX_RECORD = 500; // need get from local storage

	// define css using javascript
	const style = document.createElement('style');
	document.head.appendChild(style);
	const LOADING_IMG_URL = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/images/ui-anim_basic_16x16.gif';
	style.sheet.insertRule(`.ui-autocomplete-loading {background: white url(${LOADING_IMG_URL}) right center no-repeat;}`);
	style.sheet.insertRule('.ui-autocomplete.ui-widget {font-family: Verdana,Arial,sans-serif;font-size: 12px;}');
	style.sheet.insertRule('.ui-autocomplete {max-height: 500px; overflow-y: auto; overflow-x: hidden;')
	//

	const fixedDiv = document.createElement('div');
	fixedDiv.setAttribute('id', 'searchResult');
	fixedDiv.setAttribute("style", "position:fixed;top: 10px;left: 286px;background-color: black;color: white;font-size: small;");
	fixedDiv.setAttribute("class", "draggable");
	document.body.appendChild(fixedDiv)
	const titleDiv = document.createElement('div');
	titleDiv.setAttribute('id', 'titleDiv');
	titleDiv.setAttribute("style","margin: 3px;margin-left: 5px;font-size: 5px;");
	titleDiv.innerText = '검색 자동완성';
	fixedDiv.appendChild(titleDiv);

	const searchInput = document.createElement('input');
	searchInput.setAttribute('id', 'autoSearchInput');
	searchInput.setAttribute('type', 'text');
	searchInput.setAttribute('onClick', 'this.select();');
	fixedDiv.appendChild(searchInput);
	 
	// const selector = '#sch_search_text';
	// const selector = $('#topFrame').contents().find('#sch_search_text');
	const selector = searchInput;
	const searchURL = 'http://10.10.16.122:3000';

	// make input element draggable
	// https://stackoverflow.com/questions/3895552/jquery-draggable-input-elements
	$(".draggable").draggable({
		start: function (event, ui) {
			$(this).data('preventBehaviour', true);
		}
	});
	$(".draggable").find(":input").on('mousedown', function (e) {
		var mdown = new MouseEvent("mousedown", {
			screenX: e.screenX,
			screenY: e.screenY,
			clientX: e.clientX,
			clientY: e.clientY,
			view: window
		});
		$(this).closest('.draggable')[0].dispatchEvent(mdown);
	}).on('click', function (e) {
		var $draggable = $(this).closest('.draggable');
		if ($draggable.data("preventBehaviour")) {
			e.preventDefault();
			$draggable.data("preventBehaviour", false)
		}
	});
	//
	function embedRun(fn, args){
		const script = document.createElement("script");
		// script.text = `(${fn.toString()})(${args});`;
		script.text = '(' + fn.toString() + ')(' + args +  ');';
		document.documentElement.appendChild(script);
	}
	function sumitSearch(){
		console.log('search init!');
		fncSearch();
	}

	$(selector).autocomplete({
		source: function(request,response){
			const timer = new Timer();
			timer.start();
			var data = $(selector).val(); 
			for ( var i = 0 ; i < data.length ; i++ ) {
				if(Hangul.isHangul(data[i])){
					console.log('이건 초성검색이 아닙니다');
					break;
				}
				if(!Hangul.isHangul(data[i])){
					//초성만 입력되거나 문자가 영문 또는 'ㅗㅒ' 이런글자들이다.
					if(Hangul.isConsonant(data[i]) && !Hangul.isCho(data[i])){
					// 그리고 자음이면서, 초성으로 쓰일수 없는 글자라면... disassemble한다.
							var result = Hangul.disassemble(data).join('');
							console.log(result);	
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
					// console.log(result)
					try {
						response(
							// $.map(result.slice(0,20),function(item){
							$.map(result.slice(0,MAX_RECORD), function(item){	
								return{
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
				// submit code 넣으면 된다..검색이라든가..뭐
				// embedRun(sumitSearch);
				$('#topFrame').contents().find('#sch_search_text').next().trigger('click');
			});
		},
		// highlight matched string
		open: function (e, ui) {
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
		 }
	});	
	
	// const timer = {
	// 	startTime : null,
	// 	endTime : null,
	// 	runnig : false,
	// 	start(){
	// 		if(this.running) {
	// 			console.error('timer already started');
	// 			return false;
	// 		}
	// 		const time = new Date();
	// 		this.startTime = time.getTime();
	// 		this.running = true;
	// 	},
	// 	getDuration(){
	// 		return ((this.endTime - this.startTime ) / 1000).toFixed(5);
	// 	},
	// 	end(){
	// 		if(!this.running) {
	// 			console.error('start timer first!');
	// 			return false;
	// 		}
	// 		const time = new Date();
	// 		this.endTime = time.getTime();
	// 		this.running = false;
	// 		return this.getDuration();
	// 	},
	// }
})
	
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