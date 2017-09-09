define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");

    require("site/template.helper");
    require("pwgmodal");
    //var scroll = require("mod/common/scroll");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var layer = require("mod/common/layer");
    //var date = require("mod/common/date");
    //var loadding = require("site/loadding.js");
    //var lazyLoad = require("mod/common/lazyLoad");

    //var loaddedPage = 1;
    //var continueLoad = true;
    //var myScroll;
    var appkey = '23313321';//23290689
	var touid = '唯票北京';
	var groupId = '唯票北京';

    function init() {
        if (LS.get("userId")) {
            //console.log('IMUser_'+LS.get('userId'),appkey,util.md5('IMpass_'+LS.get('userId')));
			var uuid = 'IMUser_'+LS.get('userId');
			var passwd = util.md5('IMpass_'+LS.get('userId'));
			// 页面内展示
			WKIT.init({
				container: document.getElementById('J_demo'),
				width: 700,
				height: 500,
				uid: uuid,
				appkey: appkey,
				credential: passwd,
				touid: touid,//客服id
				sendMsgToCustomService: true,//使用客服模式
				//groupId:groupId,
				//theme: 'yellow',
				themeBgColor: '#ffdd00',
				themeColor: '#111111',
				msgBgColor: '#ffdd00',
				msgColor: '#111',
				onBack: function(content){
					window.history.go(-1);					 
				 },
				//avatar:'http://img.alicdn.com/tps/i3/TB12LD9IFXXXXb3XpXXSyFWJXXX-82-82.png',//登录用户头像
				//toAvatar:'http://img.alicdn.com/tps/i3/TB12LD9IFXXXXb3XpXXSyFWJXXX-82-82.png',//对方用户头像
				//autoMsg: '',
				//autoMsgType:0,
				//logo: 'http://img.alicdn.com/tps/i3/TB12LD9IFXXXXb3XpXXSyFWJXXX-82-82.png',
				//pluginUrl: 'http://www.taobao.com/market/seller/openim/plugindemo.php'
				});
			
            /*loginIm('IMUser_'+LS.get('userId'),appkey,util.md5('IMpass_'+LS.get('userId'))).done(function(data){
                LS.set('imuser',JSON.stringify(data));
                
            })*/
        } else {
            alert('请先登录');
			window.location.href = "../logon.html";
        }
    }
    
    init();
})