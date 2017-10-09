layui.use(['element', 'jquery', 'layer',
	'ajax', 'configAPI', 'customUtil', 'localStorage', 'customEvent'], function(){
	var element = layui.element; 
    var layer = layui.layer;
    var $ = layui.jquery;

    var ajax = layui.ajax;
    var API = layui.configAPI;
    var LS = layui.localStorage;
    var E = layui.customEvent;
    var customUtil = layui.customUtil;
    var params = customUtil.toQueryParams();

    function bindEvent(){
    	var eventsObj = {
    		login: function(){
    			var accountNum = $(".login input[name='accountNum']").val();
    			var password = $(".login input[name='password']").val();
    			if (!accountNum) {
    				layer.msg("请输入账号");
    				return;
    			}
    			if (!password) {
    				layer.msg("请输入密码");
    				return;
    			}
    			var obj = {
	    			url: "../static/js/common/test.json",
			        type: "get",
			        data: "",
			        successFn: function(){
			          location.href = "/vipiao.html";
			        },		    				
    			};
    			ajax(obj);
    		},
    		toRegister: function(){
    			location.href = "register.html";
    		},
    		register: function(){
    			var accountNum = $(".register input[name='accountNum']").val();
    			var password = $(".register input[name='password']").val();
    			var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/;
    			if (!reg.test(accountNum)) {
    				layer.msg("请填写正确的手机号码");
    				return;
    			}
    			if (!/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,12}$/.test(password)) {
    				layer.msg("请输入不小于6位的密码");
    				return;
    			}
    			var obj = {
	    			url: "../static/js/common/test.json",
			        type: "get",
			        data: "",
			        successFn: function(){
			          location.href = "/vipiao.html";
			        },		    				
    			};
    			ajax(obj);
    		},
    		save: function(){
    			var mobile = $(".forgotPwd input[name='mobile']").val();
    			var verificationCode = $(".forgotPwd input[name='verificationCode']").val();
    			var newPassword = $(".forgotPwd input[name='newPassword']").val();
    			var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/;
    			if (!reg.test(mobile)) {
    				layer.msg("请填写正确的手机号码");
    				return;
    			}
    			if (!/^\d{4}$/.test(verificationCode)) {
    				layer.msg("请输入4位数字验证码");
    				return;
    			}
    			if (!/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,12}$/.test(newPassword)) {
    				layer.msg("请输入不小于6位的密码");
    				return;
    			}
    			var obj = {
	    			url: "../static/js/common/test.json",
			        type: "get",
			        data: "",
			        successFn: function(){
			          location.href = "/vipiao.html";
			        },		    				
    			};
    			ajax(obj);
    		},
    		getVerificationCode: function(){
    			var obj = {
    				url: "../static/js/common/test.json",
    				type: "get",
    				data: "",
    				successFn: function(){
    					$(".getBtn").hide();
    					$(".countDown").show();
    					var timer = setInterval(function(){
    						var num = parseInt($(".countDown").find("span").text());
    						num--;
    						$(".countDown").find("span").text(num);
    						if (num==0) {
    							clearInterval(timer);
    							$(".countDown").hide().find("span").text("59");
    							$(".getBtn").show();
    						}
    					} , 1000)
    				}
    			};
    			ajax(obj);
    		}
    	};
    	E('body', eventsObj);
    }

    function init(){
    	
    	bindEvent();
    }
    init();
})