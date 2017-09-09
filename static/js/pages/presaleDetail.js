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

    function query_detail(data, isInit) {
        var APIData = API.Detail.query_coupon;

        //判断是否为第一次查询
        isInit = isInit || false;

        var successFn = function(res) {
            if (!res.presale_coupon) {
                layer.open({
                    content: "该预售券暂无法查看",
                    //time:2,
                    btn: ['确定'],
                    yes: function() {
                        // window.history.go(-1);
                        window.location.href = "./index.html";
                    }
                });
                return;
            }

            LS.set("couponDetail", JSON.stringify(res.presale_coupon));
            var html = template('couponT', res);
            $("#coupon").append(html);
            var data = {
                description: res.presale_coupon.description.split('\r\n').join('<br/>')
            };

            var html = template('descriptionT', data);
            $("#description").append(html);

            if(res.presale_coupon.inventory == 0){
                $("#aBtn").css('background-color','#ccc');
                $("#aBtn").attr('href','javascript:;');
            }

        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }
   

    function bindEvents() {
        var eventsObj = {            
            "buyTicket": function() {
                if (!LS.get("_vt")) {
                    LS.set("loginPage", window.location.href);
                    location.href = "logon.html";
                } else {
                    var $that = $(this);
                    var user_status = Number($that.data("user-status"));
                    var user_status_msg = "";
                    switch (user_status) {
                        case 0:
                            user_status_msg = "您尚未获得购买资格，去参加活动？";
                            break;
                        case 1:
                            user_status_msg = "好票不等人，您已经离成功不远了，继续前往邀请！";
                            break;
                        case 3:
                            user_status_msg = "您已经买过活动票，不可重复购买哦。";
                            break;
                    }

                    if (user_status === 0 || user_status == 1) {                       

                        layer.open({
                            content: user_status_msg,
                            btn: ['确定', '取消'],
                            yes: function() {
                                window.location.href = "/dist/activity/bigbang/index.php?userId="+LS.get("userId")+"&activityId="+$that.data("activity-id");
                            },
                            no: function() {
                                layer.close();
                            }
                        })
                        return;
                    } else if (user_status == 3) {
                        layer.open({
                            time: 2,
                            style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                            content: user_status_msg
                        })
                        return;
                    }
     
                    var id = $that.data("ticket-id");
                    LS.set("selectedTicket", id);

                    if (id.length == 32) {
                        window.location.href = "./orderConfirm.html?id=" + id;
                    } else {
                        layer.open({
                            type: 1,
                            style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                            content: "票品id不合法"
                        })
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
            title: JSON.parse(LS.get('couponDetail')).name, // 分享标题
            desc: JSON.parse(LS.get('couponDetail')).name, // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: JSON.parse(LS.get('couponDetail')).image_url, // 分享图标
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
        var params = util.toQueryParams();

        var data = {
            code: params.id || ""
        }
        query_detail(data, true);
        bindEvents();
        bootstrap();



    }

    init();
})