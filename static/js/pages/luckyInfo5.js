define(function(require, exports) {    
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var Swiper = require('swiper');    
    require("pwgmodal");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");
    var shareText = {};
    var isclick = LS.set('isclick','1');
    (function (doc, win) {
        var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            };          
            recalc();
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, recalc, false);
            doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
    // 获取URL参数 
    var params = util.toQueryParams();
    var isapp = params['isapp'];
    function getInfoData() {
        var APIData = API.activityList.getInfoData;
        var data = {            
            event_id: params['id'],
        }
        var successFn = function(res) {
            var result = {
                data : res[0]
            };
            shareText = {
                share_title: result.data.share_title,
                share_content: result.data.share_content,
                share_pic: result.data.share_pic
            };
            var regR = /\r/g;
            var regN = /\n/g;
            // 模板渲染
            $("#luckyInfo_title .right").text(result.data.eve_title);
            $(".contentMain").html(result.data.description.replace(regR, "<br/>"));
            
            $(".topImg img").attr("lazy-img", result.data.horiz_pic);
            lazyLoad.lazyImgLodding();
            $(".footerRight").text(result.data.buttom_title);
            if (LS.get("_vt") || params["_vt"]) {
                getShareStatus();
            }
            var html = template("mainT",result);
            $("#main").append(html);
            var html = template("joinNumT",result);
            $("#joinNum").append(html); 
            LS.set('luckyData',JSON.stringify(result.data));           
            // 事件绑定
            $(".footerLeft").click(function(){
                $(".toast").show();
                setTimeout(function(){
                    $(".toast").hide();
                },2000)
                
            });            
            if (isapp==1) {
                    var share_info = {
                        title:shareText.share_title,
                        decs:shareText.share_content,
                        img_url:shareText.share_pic,
                        url:API.mdomain+'/luckyInfo.html?id='+params['id']
                    }
                    jsInterface.appShareWithTitleDescriptionImgUrlShareUrl(share_info.title,share_info.decs,share_info.img_url,share_info.url)
            }           
            // 倒计时
            if (result.data.status == 0) {
                timeStamp(result.data.expires_time);
            }else{
                if (isapp==1) {
                    LS.set('isclick','0');             
                    $(".footerRight").css("background", "#ccc").html("已结束");
                };                
            }            
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn,
        }
        ajax(obj);
    }

    $("#footerRight").click(function(){
        var url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.vintop.vipiao";
        window.location.href=url;
    })
    // 获取转发状态
    function getShareStatus(){
        var APIData = API.activityList.getShareData;
        var data = {     
            _vt: params["_vt"] == undefined ? LS.get("_vt") : params["_vt"],       
            event_id: params['id'],
        }
        var successFn = function(res){
            if (res.data==false && isapp==1) {
                isclick = LS.set('isclick','0');
                $(".footerRight").css("background", "#ccc").html("已报名");
            }
        };
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn,
        }
        ajax(obj);
    }
    //倒计时
    function timeStamp( second_time ){
        var sel = setInterval(function() {  
            var time = parseInt(second_time) + "秒";
            var min = 0;
            var hour = 0;
            var day = 0;                        
            if( parseInt(second_time )> 60){
                var second = parseInt(second_time) % 60;  
                var min = parseInt(second_time / 60); 
                min = min < 10 ? '0' + min : '' + min;
                second = second < 10 ? '0' + second : '' + second; 
                time = min + "分" + second + "秒";              
                if( min > 60 ){
                    min = parseInt(second_time / 60) % 60;
                    min = min < 10 ? '0' + min : '' + min;  
                    var hour = parseInt( parseInt(second_time / 60) /60 ); 
                    hour = hour < 10 ? '0' + hour : '' + hour; 
                    time = hour + "小时" + min + "分" + second + "秒";        
                    if( hour > 24 ){  
                        hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                        hour = hour < 10 ? '0' + hour : '' + hour;  
                        var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                        day = day < 10 ? '0' + day : '' + day;   
                        time = day + "   天   " + hour + "   小时   " + min + "   分   " + second + "   秒";  
                    }  
                }     
            }
            if (parseInt(second_time ) <= 0) {
                LS.set('isclick','0');
                $("#countdown").html("");
                $(".footerRight").css("background", "#ccc").html("已结束");
                clearInterval(sel);
                return;
            } else{
                var html = '<p class="luckyInfoTime">'+
                                '<img src="../static/images/time2x.png">   '+
                                '  距结束   '+
                                '<span class="remainingTime">   '+time+'   </span>'+
                            '</p>';
                $("#countdown").html(html);
            };            
            second_time--;
        }, 1000);
    }
    // 微信分享
    var bootstrap = function () {
        $.ajax({
            url : API.adomain+'/common/wechat/sign',
            type : 'get',
            dataType : 'json',
            success : function(res){
                localStorage.setItem("wxdata",JSON.stringify(res.data));
                configWeixin(res.data);            
            }
        });        
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
            debug: false,
            appId: 'wx880d5f7416ee1d4a',
            timestamp: options.timestamp,
            nonceStr: options.nonceStr,
            signature: options.signature,
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
            title: shareText.share_title, // 分享标题
            desc: shareText.share_content, // 分享描述
            link: API.mdomain+'/luckyInfo.html?id='+params['id'], // 分享链接
            imgUrl: shareText.share_pic,
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
        getInfoData();        
        bootstrap();
    }    
    init();
})