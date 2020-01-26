// window.onload = function() {
// 	alert('load')
// }

$(window).load(function(){   
	const selector = '#sch_search_text';
	// Althought input element is in topLevel iframe,
	// all_frame : true option makes selector selectable.
	// otherwise, we need to find selector in iframe.
	const gnbWrap = '#gnbWrap';
	const docTop = '#layout-doc';

	const autocompleteMirror = $('<input type="text" id="autocompleteMirror"></input>');
	const container = $('<div class="ui-widget-content"></div>');
	container.append(autocompleteMirror);
	// $(gnbWrap).append(container);
	$('body').prepend(container);
	console.log(autocompleteMirror)
	container.draggable();
	const searchURL = 'http://127.0.0.1:3000';
	$(selector).on('input',(event) => {
			console.log(event.target.value)
			autocompleteMirror.val(event.target.value);
	})
	$(autocompleteMirror).autocomplete({
		source: function(request,response){
			// timer.start();
			var data = $(autocompleteMirror).val(); 
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
							$.map(result.slice(0,20),function(item){
								return{
									label : item.artistName + ' : '+ item.songName,
									value: item.artistName + ' : '+ item.songName
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
				console.log($(autocompleteMirror).val());
				// submit code 넣으면 된다..검색이라든가..뭐
			});
		},
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
    