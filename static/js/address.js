var init = function(){

	$('.setDefaultBtn').on('click',function(){
		$('.defaultAddressBox').removeClass('defaultAddressBox');
		$(this).parents('li').addClass('defaultAddressBox');
	});

	$('.deleteAddrBtn').on('click',function(){
		$(this).parents('li').remove();
		if($('.addressList li').length === 0){
			$('.addressList').hide();
			$('.emptyWrapper').show();
		}
	});

};

$(document).ready(function(){
	init();
});
