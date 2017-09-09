define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var E = require("mod/common/event");
    var ajax = require("mod/common/ajax");
    var util = require("mod/common/util");
    var layer = require("mod/common/layer");
    var LS = require("mod/common/localStorage");

    // var Encrypt = require("mod/common/encrypt");
    var orderDetail = {};

    function get_order(data) {
        var APIData = API.Order.get_order;

        var successFn = function(res) {
            if (!res.order) {
                return;
            }
            orderDetail = res.order;
            /*var create_time = get_unix_time(orderDetail.created_at);
            var server_time = get_unix_time(orderDetail.now);

            var remains_time = (15 * 60 * 1000 - (server_time - create_time)) / 1000 + 5;
            remains_time = remains_time > 0 ? remains_time : 0;
            if(orderDetail.status!=0){
                remains_time = 0;
            }*/
            var remains_time = Math.ceil(orderDetail.valid_span);
            var minute = Math.floor(remains_time / 60);
            var second = remains_time % 60;

            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;

            var remains = minute + ":" + second;

            orderDetail.coupon_money = orderDetail.coupon_money || 0;

            orderDetail.remains = remains;

            var html = template('orderDetailT', orderDetail);
            $("#orderDetail").append(html);

            if (LS.get('sourcetype')=='kejiang' && LS.get('kj_openuserid')) {
                $("#alipay").hide();
                $("#weixinpay").hide();
                LS.set("payType", "2");
            } else{
                if (isWeiXin()) {
                    $("#alipay").hide();
                    $("#Pufapay").hide();
                    LS.set("payType", "1");
                } else {
                    $("#weixinpay").hide();
                    $("#Pufapay").hide();
                    LS.set("payType", "0");
                }
            }          

            if (remains_time > 0)
                countDown(remains_time)
        }


        function countDown(time) {
            var interval = setInterval(function() {
                var remains_time = time > 0 ? time : 0;

                var minute = Math.floor(remains_time / 60);
                var second = remains_time % 60;

                minute = minute >= 10 ? minute : "0" + minute;
                second = second >= 10 ? second : "0" + second;

                var remains = minute + ":" + second;
                $("#countDown").text(remains);
                if (time == 0) {
                    orderDetail.status = 2;
                    var html = template('orderDetailT', orderDetail);
                    $("#orderDetail").empty().append(html);
                    clearInterval(interval);
                }

                time--
            }, 1000);
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

    function gotoPay(res) {
        var zfbData = {
            sl: res.number,
            ddbh: res.order_code,
            je: res.amount
        }

        if (LS.get("sourcetype")=='kejiang' && LS.get("kj_openuserid")) {
            Pufapay(res.order_code);
        }else{
            if (!isWeiXin()) {
                var form = $('<form></form>');            
                form.attr('action', "/zfb/alipayapi.php");
                form.attr('method', 'post');

                form.attr('target', '_self');
                var my_input = $('<input type="text" name="sl" />');
                my_input.attr('value', res.number);
                form.append(my_input);

                var my_input = $('<input type="text" name="ddbh" />');
                my_input.attr('value', res.order_code);
                form.append(my_input);

                var my_input = $('<input type="text" name="je" />');
                my_input.attr('value', res.amount);
                form.append(my_input);

                var my_input = $('<input type="text" name="break_url" />');
                my_input.attr('value', window.location.href);
                form.append(my_input);
                // 提交表单  
                form.submit();
            } else{
                wxpay(res);
            }
        }        
    }
    // 科匠支付
    function Pufapay(order_code) {
        var APIData = API.Order.pufaPay;
        var data = {
            _vt: LS.get("_vt"),
            kejiang_source: LS.get("kejiang_source")?LS.get("kejiang_source"):''||"",
            order_code:order_code,
            open_userid:LS.get('kj_openuserid')
        }
        var successFn = function(res) {
            window.location.href=res.url;
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }       
        ajax(obj);
    }
    function wxpay(res) {
        var url = API.adomain+"/v3/webpay/wei-chat-pay?fee=" + res.amount * 100 + "&out_trade_no=" + res.order_code;
        window.location.href = url;
    }
    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }

    function get_unix_time(dateStr) {
        var newstr = dateStr.replace(/-/g, '/');
        var date = new Date(newstr);
        var time_str = date.getTime().toString();
        return time_str;
    }

    function bindEvents() {
        var eventsObj = {
            gotoPay: function() {
                gotoPay(orderDetail);
            },
            "giftcont":function(){
                var id = $(this).data("id");
                window.location.href = "/goodDetail.html?id=" + id;
            }
        };

        E.actionMap("body", eventsObj);
    }

    function init() {
        var obj = util.toQueryParams();
        var data = {
            code: String(obj.id)
        }
        bindEvents();
        get_order(data);


    }

    init();
})