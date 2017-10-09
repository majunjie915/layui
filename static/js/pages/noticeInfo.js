layui.use(['element', 'form', 'jquery'], function(){
	var element = layui.element,
		form = layui.form,
		$ = layui.jquery;




	function init(){
		$(".nav_left li:eq(0)").addClass("layui-nav-itemed").end().find("dd.vipiao").addClass("layui-this");
	}
	init();
})