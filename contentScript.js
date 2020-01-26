// window.onload = function() {
// 	alert('load')
// }

$(window).load(function(){   

	// Althought input element is in topLevel iframe,
	// all_frame : true option makes selector selectable.
	// otherwise, we need to find selector in iframe.
	// after all_frame value set true, the content script can access only in that frame element
	// so, don't use all_frame, but access element in frame using contents() api in jQuerh
	// like const selector = $('#topFrame').contents().find('#sch_search_text');

	const MAX_RECORD = 100; // need get from local storage
	// define css using javascript
	const style = document.createElement('style');
	document.head.appendChild(style);
	const LOADING_IMG_URL = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/images/ui-anim_basic_16x16.gif';
	style.sheet.insertRule(`.ui-autocomplete-loading {background: white url(${LOADING_IMG_URL}) right center no-repeat;}`);
	style.sheet.insertRule('.ui-autocomplete.ui-widget {font-family: Verdana,Arial,sans-serif;font-size: 12px;}');
	style.sheet.insertRule('.ui-autocomplete {max-height: 500px; overflow-y: auto; overflow-x: hidden;')
	
	const fixedDiv = document.createElement('div');
	fixedDiv.setAttribute('id', 'searchResult');
	fixedDiv.setAttribute("style", "position:fixed;top: 107px;right: 5px;background-color: gray;color: black;font-size: small;");
	document.body.appendChild(fixedDiv)
	const searchInput = document.createElement('input');
	searchInput.setAttribute('id', 'autoSearchInput');
	searchInput.setAttribute('type', 'text');
	fixedDiv.appendChild(searchInput);
	 
	// const selector = '#sch_search_text';
	// const selector = $('#topFrame').contents().find('#sch_search_text');
	const selector = searchInput;
	const searchURL = 'http://127.0.0.1:3000';

	$(selector).autocomplete({
		source: function(request,response){
			// timer.start();
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
					// const elapsed = timer.end();
					// $('#result').text(`Search Success : ${count} words, ${elapsed} sec`);
					console.log(result)
					response(
							// $.map(result.slice(0,20),function(item){
							$.map(result.slice(0,MAX_RECORD), function(item){	
								return{
									label : item.artistName + ' : '+ item.songName,
									value: item.artistName + ' : '+ item.songName,
									artistName : item.artistName, 
									songName :  item.songName,
								};							
							})
						);
					
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
				// let textWrapper = me.find('.ui-menu-item-wrapper'); let text = textWrapper.text(); let newTextHtml = text.replace(new RegExp("(" + keywords + ")", "gi"), '<b>$1</b>'); textWrapper.html(newTextHtml);
			 });
		 }
    });	
})
    