define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var util = require("mod/common/util");
    var LS = require("mod/common/localStorage");
    var E = require("mod/common/event");
    var validatorForm = require("mod/common/validatorForm");
    var Encrypt = require("mod/common/encrypt");
    var layer = require("mod/common/layer");
    var fca = require("mod/common/fca");
    var identity_card = require("mod/common/identity_card");
	var loadding = require("site/loadding.js");

    function addOrder() {
        var APIData = API.Order.create_presale_order;

        var customer = {};            
        customer.customer_name = $("#fetchForm [name=customer_name]").val().trim();
        customer.customer_mobile = $("#fetchForm [name=customer_mobile]").val().trim();

        if(!customer.customer_name || !customer.customer_mobile){
            layer.open({
                content: "购票信息填写不完整",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 2
            })
            return false;
        }else if(!/^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(customer.customer_mobile)){
            layer.open({
                content: "购票人手机号有误",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 2
            })
            return false;
        }  
        var addressId = LS.get("addressId") || "";        
        var coupon = JSON.parse(LS.get("couponDetail")) || "";
        var remarksinfo = $("#remarks").val();
        var data = {
            _vt: LS.get("_vt"),
            source: "h5",
            pay_type: LS.get("payType") || 0,
            number: LS.get("orderNumber") || 1,
            commodity_code: coupon.code,
            customer_name: customer.customer_name || "",
            customer_mobile: customer.customer_mobile || "",
            remarks : remarksinfo || ""
        }
		// loadding.create(1,1);
		$(".aBtn").css("background","#ccc");
		$(".aBtn").attr("data-action","");
        
        // var data = {
        //     rsa_str: Encrypt.encrypt(formObj)
        // };

        var successFn = function(res) {            
            gotoPay(res);

            function gotoPay(res) {                
                var zfbData = {
                    sl: res.order.number,
                    ddbh: res.order.order_code,
                    je: res.order.amount
                }


                if (!isWeiXin()) {
                    var form = $('<form></form>');

                    if (/pgkfw|localhost/.test(document.domain)) {
                        form.attr('action', "/zfb/alipayapi.php");
                    } else {
                        form.attr('action', "/zfb/alipayapi.php");
                    }
                    form.attr('method', 'post');

                    form.attr('target', '_self');
                    var my_input = $('<input type="text" name="sl" />');
                    my_input.attr('value', res.order.number);
                    form.append(my_input);

                    var my_input = $('<input type="text" name="ddbh" />');
                    my_input.attr('value', res.order.order_code);
                    form.append(my_input);

                    var my_input = $('<input type="text" name="je" />');
                    my_input.attr('value', res.order.amount);
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

        var beforeFn = function() {
            //loadding.create($listEle, 1);
            // loadding.create(1,1);
        }

        var afterFn = function() {
            // $(".pageLoadding").remove();
            // $(".scrollDiv").show();
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            beforeFn: beforeFn,
            afterFn: afterFn,
            successFn: successFn
        }

        ajax(obj);
    }
	
	function wxpay(res) {
        var url = API.adomain+"/v3/webpay/wei-chat-pay?fee=" + res.order.amount * 100 + "&out_trade_no=" + res.order.order_code;
        window.location.href = url;
    }

    function renderOrder() {
        var program = JSON.parse(LS.get("couponDetail"));
        var selectedTicket = LS.get("selectedTicket");
        ticketObj = program;
        //console.log(selectedArea);
        if (program && program.code) {            
            //console.log(program);
            var html2 = template('buyNumT', program);
            $("#buyNum").empty().append(html2);

            couponDetail = JSON.parse(LS.get('couponDetail'));
            var html = template('ticketInfoT', couponDetail);
            $("#ticketInfo").empty().append(html);

            var html = template('deliveryModeT', program);
            $("#deliveryMode").empty().append(html);

            creatOrderDetail(1);

            orderData = program;
        } else {
            //console.log(program);
            layer.open({
                content: '出错了',
                time: 1
            });
        }


    }

    function creatOrderDetail(buynumber) {
        //var buynumber = 1;
        //
        //根据购买数量计算折扣
        //计算下是否已经超过了限购或者
        buynumber = buynumber || LS.get("orderNumber");
        if (buynumber > ticketObj.buy_limit && ticketObj.buy_limit != 0) {
            layer.open({
                content: "该产品限购" + ticketObj.buy_limit + "张",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            return;
        }
        if (buynumber > ticketObj.inventory) {
            layer.open({
                content: "已经超过库存啦",
                time: 1
            })
            return;
        }

        $("#buynumber").text(buynumber);
        orderData.number = buynumber;
        LS.set("orderNumber", buynumber);

        buynumber = buynumber || LS.get("orderNumber") || 0;
        $("#countPrice").text((buynumber * ticketObj.price).toFixed(2));
        var orderDetail = {
            ticket: ticketObj,            
            buynumber: buynumber,
            order_money: ticketObj.price * buynumber ,
            amount: ticketObj.price * buynumber
        }        
        var html3 = template("orderDetailBoxT", orderDetail);
        $("#orderDetailBox").empty().append(html3);
    }

    function bindEvents() {
        var $buyNumEle = $("#buynumber");        
        var eventsObj = {
            "minusNum": function() {
                buynumber = parseInt($buyNumEle.text()) - 1 >= 1 ? parseInt($buyNumEle.text()) - 1 : 1;
                creatOrderDetail(buynumber);

            },
            "addNum": function() {
                buynumber = parseInt($buyNumEle.text()) + 1 <= 500 ? parseInt($buyNumEle.text()) + 1 : 500;
                creatOrderDetail(buynumber);

            },
            "selectPayType": function() {
                var pay_type = $(this).data("type");
                LS.set("payType", pay_type);

                $(this).siblings().removeClass("active").end().addClass("active");
            },

            "addOrder": function() {
                addOrder();
            },
            "goBack": function() {
                var coupon = JSON.parse(LS.get("couponDetail")) || "";
                if (/active/.test(document.referrer)) {
                    window.history.back();
                } else {
                    window.location.href = "./presaleDetail.html?id="+coupon.code;
                }
            }
        };

        E.actionMap("body", eventsObj);

        $("#addressListArticle").delegate(".addbox", "click", function() {
            var addressId = $(this).data("address-id");
            LS.set("addressId", addressId);
            // $(this).parent().siblings().removeClass("active").end().addClass("active");

            var addressIndex = $(this).data("index");

            var data = {
                list: [addressList[addressIndex]]
            }
            var html = template('expressOrderT', data);
            $("#expressWrapper").empty().append(html);
            $('#mainArticle,.subArticle').hide();
            $("#mainArticle").show();
            getAddress2();

            LS.set("selectedAddress", addressId);

        });

        $(".bodywarp").delegate(".addAddressBtn", "click", function() {
            $("form[name=addAddressForm]")[0].reset();
        })
    }

    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();

        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }

    function init() {        
        renderOrder();
        bindEvents();

        var fileds = [{
            name: 'customer_name',
            rules: 'required'
        }, {
            name: 'customer_mobile',
            rules: 'required|mobile'
        }];
        validatorForm('fetchForm', fileds, addOrder);

        var fileds = [{
            name: 'name',
            rules: 'required'
        }, {
            name: 'mobile',
            rules: 'required|mobile'
        }];

        //validatorForm('addAddressForm', fileds, addAddress);

        util.initTab($('.tabWrapper'));

        LS.set("delivery_mode", '0');
        

        LS.set("orderNumber", 1);
        if (isWeiXin()) {
            $("#alipay").hide();
            LS.set("payType", "1");
        } else {
            $("#weixinpay").hide();
            LS.set("payType", "0");
        }
    }
    if(LS.get("_vt") == undefined || !LS.get("_vt")){
        LS.set("loginPage",window.location.href);
        location.href="./logon.html";
        return;
    }

    var orderData = {};
    var addressList = [];
    orderData.number = 1;

    ticketDiscount = [];
    var couponMoney = 0;

    init();
})