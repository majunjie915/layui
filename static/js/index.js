var showModal = function(){
	$.pgwModal({
	    target: '#modalContent',
	    titleBar : false
	});
}

var slideBody = function(){
	$('body').addClass('slidedBody');
	$('.pm-body').css('height',window.innerHeight).css('margin',0);
}

var unSlideBody = function(){
	$('body').removeClass('slidedBody');
}


	$(".menuTrigger").on("click",function(){
		showModal();
		slideBody();
	})

	$(document).on('PgwModal::Close', function() {
		unSlideBody();
	})

	/*//swiper
	var swiper = new Swiper('.swiper-container', {
	  pagination: '.swiper-pagination',
	  paginationClickable: true,
	  loop: true,
	  autoplay : 5000
    });*/



$(document).ready(function(){
	init();
});
