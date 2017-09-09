var init = function(){

	$('.searchField').on('click',function(){
		$(this).siblings('.clearBtn').show();
	});
	$('.searchField').on('blur',function(){
		$(this).siblings('.clearBtn').hide();
	});

	$(".tabBox a").on('click',function(){
		var selector = '#' + $(this).attr('data-switch-tab');
		$('.tabBox a').removeClass('active');
		$(this).addClass('active');
		$(selector).siblings().hide();
		$(selector).show();
	})
};

$(document).ready(function(){
	init();
});
