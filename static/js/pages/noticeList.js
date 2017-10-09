layui.use(['element', 'layer', 'jquery', 'laytpl',
  'ajax', 'configAPI', 'customUtil', 'localStorage', 'customEvent', 'customDate'], function(){
	var element = layui.element; 
    var layer = layui.layer;
    var $ = layui.jquery;
    var laytpl = layui.laytpl;

    var ajax = layui.ajax;
    var API = layui.configAPI;
    var LS = layui.localStorage;
    var E = layui.customEvent;
    var formatDate = layui.customDate;
    var customUtil = layui.customUtil;
    var params = customUtil.toQueryParams();




	function init(){
		$(".nav_left li:eq(0)").addClass("layui-nav-itemed").end().find("dd.vipiao").addClass("layui-this");
	}
	init();
})