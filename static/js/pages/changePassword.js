layui.use(['element', 'form', 'jquery', 'layer', 
	'ajax', 'configAPI', 'localStorage', 'customUtil', 'customEvent'], function(){
	var element = layui.element,
		form = layui.form,
		$ = layui.jquery,
		layer = layui.layer,

		ajax = layui.ajax,
		API = layui.configAPI,
		LS = layui.localStorage,
		customUtil = layui.customUtil,
		E = layui.customEvent;

		function bindEvent(){
			var eventObj = {
				verifyPassword: function(){
					var formData = {};
					formData.oldPassword = $("input[name='oldPassword']").val();
					formData.newPassword = $("input[name='newPassword").val();
					formData.confirmPassword = $("input[name='confirmPassword").val();

					if (formData.oldPassword != "111111") {
						layer.msg("原密码不正确");
						return;
					}
					if (formData.newPassword.length < 6 || formData.newPassword.length>20) {
						layer.msg("请输入长度为6-20位的新密码");
						return;
					}
					if (formData.newPassword != formData.confirmPassword) {
						layer.msg("两次密码输入不一致");
						return;
					}
					layer.msg("修改密码成功");
				}
			};
			E("body", eventObj);
		}

		function init(){

			bindEvent();
		}
		init();
})