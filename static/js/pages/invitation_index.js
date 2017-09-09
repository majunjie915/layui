define(function(require, exports) {    
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");

    require("site/template.helper");
    require("pwgmodal");
    // var scroll = require("mod/common/scroll");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var layer = require("mod/common/layer"); 

    function get_invitation(data){
        var APIData = API.fandom.invitation;
        var successFn = function(res) {
            LS.set('shareInfo',JSON.stringify(res));
            var html = template('pagecontT', res);
            $('#pagecont').append(html);
            console.log(res);
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }
        ajax(obj);
    }   

    function bindEvent() {
        var eventsObj = {
            "btn_invit": function() {
                layer.open({
                    content: '请点击微信右上角分享哟~',
                    style: 'background-color:#000; color:#fff; border:none;',
                    time:2
                });
            }           
        }
        E.actionMap("body", eventsObj);
    }
    // 微信分享
    var bootstrap = function () {
        var APIData = API.fandom.get_wechat;
        var data = {};
        data.url = location.href.split('#')[0];
        var successFn = function(res) {
            configWeixin(res);
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,            
            successFn: successFn
        }
        ajax(obj);      
    };

    var setupWeixinShare = function (message) {
            wx.onMenuShareTimeline(message);
            wx.onMenuShareAppMessage(message);
            wx.onMenuShareQQ(message);
            wx.onMenuShareWeibo(message);
            wx.onMenuShareQZone(message);
    };
    var configWeixin = function (options) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx880d5f7416ee1d4a', // 必填，公众号的唯一标识
            timestamp: options.timestamp, // 必填，生成签名的时间戳
            nonceStr: options.nonceStr, // 必填，生成签名的随机串
            signature: options.signature,// 必填，签名，见附录1
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
    };

    wx.ready(function () {
        setupWeixinShare({
            title: JSON.parse(LS.get('shareInfo')).share_title, // 分享标题
            desc: JSON.parse(LS.get('shareInfo')).share_desc, // 分享描述
            link: JSON.parse(LS.get('shareInfo')).share_url, // 分享链接
            imgUrl: JSON.parse(LS.get('shareInfo')).share_img, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
    function init() {
        if (LS.get("_vt")) {
           var data = {
            _vt: LS.get("_vt") || ""
            } 
        }else{
            LS.set("loginPage", window.location.href);
            location.href = "logon.html";
        }; 
        bindEvent();        
        get_invitation(data);
        bootstrap();
    }
    init();
})