define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var E = require("mod/common/event");
    var ajax = require("mod/common/ajax");
    var LS = require("mod/common/localStorage");
    var loadding = require("site/loadding.js");
    var layer = require("mod/common/layer");
    var util = require("mod/common/util");

    var couponObj = JSON.parse(localStorage.getItem("couponObj"));
    
    $(".coupons").append("<img src="+couponObj.coupPic+">");

    function uploadImg(){
        $.ajax({
            url : API.adomain+'/v3/activity/img',
            type : 'post',
            dataType : 'json',
            data : {
                "upfile" : localStorage.getItem("img")
            },
            success : function(res){
                if (res.status_code=200) {
                    $(".canvasImg").html("<img src="+res.data.img_url+">");
                } else{
                    alert(res.message);                            
                };

            }
        });
    }
    function bindEvent() {
        var eventsObj = {
            "again":function() {
                window.location.href = "./canvas.html";
            },
            "downloadAPP": function() {
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.vintop.vipiao";
            },
            'shareBtn' : function(){
                layer.open({
                    time: 2,
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    content: '请点击微信右上角分享哟~'
                })                
            },
            "getCoupons": function() {
                var _vt = LS.get("_vt");
                if (!_vt) {
                    window.location.href = "./logon.html?r=lover";
                }else{
                    // 点击领取优惠券
                    var coupon_code = "";
                    var ttt = $(this);
                    if (_vt) {
                        $.ajax({
                            url : API.adomain+'/v3/activity/activity102',
                            type : 'post',
                            dataType : 'json',
                            data : {
                                coupon_code:couponObj.coupCode,
                                _vt:_vt
                            },
                            success : function(res){
                                if (res.status_code=200) {
                                    window.location.href = "./getWelfare.html"
                                } else{
                                    layer.open({
                                        content: '你的3次机会用完了，明天再来吧！分享给朋友/爱人，机率加倍！',
                                        style: 'background-color:rgba(0,0,0,.6); color:#fff; border:none;',
                                        time: 3
                                   })                          
                                };

                            }
                        });
                    } 
                    
                }
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
            title: "画符抽情人节门票、海量福利等你拿", // 分享标题
            desc: "画符召唤情人节门票，一不小心就脱单，你也快来吧！", // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: JSON.parse(LS.get('img')), // 分享图标
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
        uploadImg();
        bootstrap();
        bindEvent();
    }
    init();
})