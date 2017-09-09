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
        var APIData = API.Order.create_order;
        var presalecouponds = new Array();
        if (LS.get("delivery_mode") == '1' || LS.get("delivery_mode") == '2') {
            var customer = {};
            customer.customer_name = $("#fetchForm [name=customer_name]").val().trim();
            customer.customer_mobile = $("#fetchForm [name=customer_mobile]").val().trim();
            customer.identification = $("#fetchForm [name=identification]").val().trim();
            if(!customer.customer_name || !customer.customer_mobile || !customer.identification){
                layer.open({
                    content: "取票收货人信息填写不完整",
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    time: 2
                })
                return false;
            }else if(!/^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/.test(customer.customer_mobile)){
                layer.open({
                    content: "取票收货人手机号有误",
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    time: 2
                })
                return false;
            }else if(!identity_card(customer.identification)){
                layer.open({
                    content: "取票收货人身份证号有误",
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    time: 2
                })
                return false;
            }   
        }
        var addressId = LS.get("addressId") || "";
        var open_userid = LS.get("kj_openuserid") ? LS.get("kj_openuserid"):''||"";
        var kejiang = LS.get("sourcetype")=="kejiang" ? "kejiang" : ''||"";
        var data = {
            _vt: LS.get("_vt"),
            address_id: addressId,
            source: "h5",
            kejiang_source: LS.get("kejiang_source")?LS.get("kejiang_source"):''||"",
            pay_type: LS.get("payType") || 0,
            ticket_number: LS.get("orderNumber") || 1,
            ticket_id: orderData.uuid,
            abc: orderData.abc ? orderData.abc:''||"",
            coupon_id: LS.get("couponId") || "",
            delivery_mode: LS.get("delivery_mode"),
            customer_name: customer ? customer.customer_name : '' || "",
            customer_mobile: customer ? customer.customer_mobile : '' || "",
            customer_identification: customer ? customer.identification : '' || "",
            open_userid: open_userid,
            kejiang:kejiang
        }

        //if (LS.get("delivery_mode") == '0') {
            $(".presalecouponlist").find('li').each(function(index,obj){
                if($(obj).attr('class').indexOf('active') > -1){
                    presalecouponds.push($(obj).attr('data-presale-coupon-id'));
                }
            });
            data.presale_coupon_id = presalecouponds.join(',');
        //}
        //console.log(formObj);

        $(".aBtn").css("background","#ccc");
        $(".aBtn").attr("data-action","");

        // loadding.create(1,1);
        if (LS.get("delivery_mode") !== '1' && LS.get("delivery_mode") !== '2' && !addressId) {
            layer.open({
                content: "请添加收货人信息",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            return;
        }

        var successFn = function(res) {
            // console.log(res);
            // return;            
            gotoPay(res);
            function gotoPay(res) {
                //console.log(res);
                var zfbData = {
                    sl: res.order.number,
                    ddbh: res.order.order_code,
                    je: res.order.amount
                }
                if (LS.get("sourcetype")=='kejiang' && LS.get("kj_openuserid")) {
                    Pufapay(res.order.order_code);
                }else{
                    if (!isWeiXin()) {
                        var form = $('<form></form>');
                        form.attr('action', "/zfb/alipayapi.php");
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
        }

        var beforeFn = function() {
            loadding.create(1,1);
        }

        var afterFn = function() {
            // loadding.removeAll();
            $(".layermbox2").hide();
            $(".aBtn").css("background","#ffc719");
            $(".aBtn").attr("data-action","addOrder");
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
		loadding.create(1,1);
        var url = API.adomain+"/v3/webpay/wei-chat-pay?fee=" + res.order.amount * 100 + "&out_trade_no=" + res.order.order_code;
        window.location.href = url;
    }

    function getAddress(dataObj) {
        var APIData = API.Address.get_my_address;
        data = dataObj || {};
        data._vt = LS.get("_vt");

        var successFn = function(res) {
            addressList = res.address;
            var data = {
                list: res.address
            };
            if (!res.address || !res.address.length) {
                var data = {
                    list: []
                }
                var html = template('expressOrderT', data);
                $("#expressWrapper").append(html);
            } else if (res.address.length && !dataObj) {
                var data = {
                    list: [res.address[0]]
                }
                var html = template('expressOrderT', data);
                $("#expressWrapper").append(html);
                LS.set("selectedAddress", res.address[0].id);
                LS.set("addressId", res.address[0].id);

                var data2 = {
                    list: res.address,
                    selectedAddress: LS.get("selectedAddress") || 0
                }

                var html2 = template('expressListT', data2);
                $("#addressListArticle").append(html2);

                if (orderData.express_mode == "0") {
                    $("#expressWrapper").hide();
                    $("#fetchWrapper").show();
                }
            } else {

                //处理修改地址
                if (dataObj && dataObj.id) {
                    $('#mainArticle,.subArticle').hide();
                    $("#edit-address-article").show();

                    var obj = res.address[0];

                    $("#edit-address-article input[name=name]").val(obj.name);
                    $("#edit-address-article input[name=mobile]").val(obj.mobile);
                    $("#edit-address-article textarea[name=address]").val(obj.address);
                    var obj2 = {
                        province: obj.province.code || '',
                        city: obj.city.code || '',
                        area: obj.area.code || '',
                    }

                    fca(3, "editfcaSelect", null, obj2);
                    return;
                }

                var data = {
                    list: [res.address[0]]
                }
                var html = template('expressOrderT', data);
                $("#expressWrapper").append(html);

                LS.set("selectedAddress", res.address[0].id);
                LS.set("addressId", res.address[0].id);

                var data2 = {
                    list: res.address,
                    selectedAddress: LS.get("selectedAddress") || 0
                }

                var html2 = template('expressListT', data2);
                $("#addressListArticle").append(html2);
            }

        }

        var beforeFn = function() {
            loadding.create($listEle, 1);
        }

        var afterFn = function() {
            loadding.removeAll();
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

    function getAddress2(dataObj) {
        var APIData = API.Address.get_my_address;
        data = dataObj || {};
        data._vt = LS.get("_vt");
        var successFn = function(res) {
            addressList = res.address;

            if (!res.address.length) {
                var data2 = {
                    list: res.address,
                    selectedAddress: 0
                }
                var html = template('expressOrderT', data2);
                $("#expressWrapper").empty().append(html);

                $('#mainArticle,.subArticle').hide();
                $("#mainArticle").show();
            } else {
                var data2 = {
                    list: res.address,
                    selectedAddress: LS.get("selectedAddress") || res.address[0].id
                }
                if (!LS.get("selectedAddress")) {
                    LS.set("selectedAddress", res.address[0].id);
                }
                var html2 = template('expressListT', data2);
                $("#addressListArticle").empty().append(html2);
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

    function addAddress(form) {
        var APIData = API.Address.add_my_address;
        var form = $("[name='" + form + "']");
        var data = util.fromDataToJSON(form, true);
        data._vt = LS.get("_vt");

        var successFn = function(res) {
            var data = {
                list: res.address
            }
            address = res.address;
            var html = template('expressOrderT', data);
            $("#expressWrapper").empty().append(html);

            getAddress2();

            LS.set("addressId", address[0].id);
            LS.set("selectedAddress", address[0].id);
            $('#mainArticle,.subArticle').hide();
            $("#mainArticle").show();
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

    function editAddress(form) {
        var APIData = API.Address.update_my_address;
        var form = $("[name='" + form + "']");
        var data = util.fromDataToJSON(form, true);

        data._vt = LS.get("_vt");
        data.id = LS.get("editAddressId")
        var successFn = function(res) {
            var data = {
                list: res.address
            }

            var html = template('expressOrderT', data);
            $("#expressWrapper").empty().append(html);
            LS.remove("editAddressId");
            LS.set("addressId", res.address[0].id);
            LS.set("selectedAddress", res.address[0].id);
            $('#mainArticle,.subArticle').hide();
            $("#mainArticle").show();
            getAddress2();
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

    function deleteAddress(data, ele) {
        var APIData = API.Address.delete_my_address;
        data = data || {};

        var successFn = function(res) {
            ele.remove();

            if (data.address_id == LS.get("selectedAddress")) {
                LS.remove("selectedAddress");
            }
            $('.subArticle').hide();
            $("#address-article").show();
            getAddress2();
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }


        ajax(obj);
    }


    function setDefaultAddress(data, ele) {
        var APIData = API.Address.change_default_address;
        data = data || {};

        var successFn = function(res) {
            getAddress2()
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

    function renderOrder() {

        var program = JSON.parse(LS.get("programDetail"));
        var areas = JSON.parse(LS.get("ticketDetail"));

        var selectedScene = LS.get("selectedScene");
        var selectedArea = LS.get("selectedAreaId");
        var selectedTicket = JSON.parse(LS.get("selectedTicket"));
        // console.log(selectedTicket);
        // console.log(packageList);
        var scenes = program.scenes,
            l = scenes.length;
        var scene = {};
        var area;
        var ticket = {};

        for (var i = 0; i < l; i++) {
            if (selectedScene == scenes[i].uuid) {
                scene = scenes[i];
                break;
            }
        }
        // for (var i = 0; i < packageList.; i++) {
        //     if (selectedScene == scenes[i].uuid) {
        //         scene = scenes[i];
        //         break;
        //     }
        // }

        /*
        //取得所选的场次
        var b = areas.length;

        for (var a = 0; a < b; a++) {
            if (selectedArea === areas[a].uuid) {
                area = areas[a];
                break;
            }
        }

        if (area) {
            var tickets = area.tickets
                //取得所选的票品
            var n = tickets.length;
            for (var m = 0; m < n; m++) {
                if (selectedTicket == tickets[m].uuid) {
                    ticket = tickets[m];
                    break;
                }
            }
        }
        */

        row = LS.get('selectedRow');

        area = LS.get('selectedArea');
        ticket = JSON.parse(LS.get('selectedTicket'));
        //console.log(program);
        //console.log(row);
        //console.log(selectedArea);
        if (ticket && ticket.uuid) {
            var data = {};

            data.title = program.title;            
            data.ticketImg = program.portrait_id;
            data.start_time = scene.start_time;
            data.city_name = scene.city.name;
            data.venue_name = scene.venue.name;
            data.areaname = area + ' ' + row;
            data.ticket = ticket;
            data.discount = 10;
            ticketObj = ticket;
            //console.log("123",ticketObj);

            //console.log(data);
            var html = template('ticketInfoT', data);
            $("#ticketInfo").empty().append(html);
            if (ticket.discount) {
                var numsplit = []
                for (var c = 0; c < ticket.discount.length; c++) {
                    numsplit.push(Number(ticket.discount[c].number));
                }
                ticketDiscount = numsplit.sort(function(a, b) {
                    return a - b > 0
                });
            }

            var html2 = template('buyNumT', data);
            $("#buyNum").empty().append(html2);

            var html = template('deliveryModeT', data.ticket);
            $("#deliveryMode").empty().append(html);

            creatOrderDetail(1);
            orderData = data;
        } else {

            layer.open({
                content: '出错了',
                time: 1
            });
        }


    }
    function renderOrder2(data) {
        var APIData = API.Order.checkout;
        var successFn = function(res) {
            orderData = res.ticket;
            if (res.ticket && res.ticket.uuid) {
                var html = template('ticketInfoT', res);
                $("#ticketInfo").empty().append(html);

                var data = {
                    list:res.coupon
                }
                if (res.coupon.length==0) {
                    $("#couponList").hide();
                } else{
                    var html = template('couponT', data);
                    $("#couponList").empty().append(html);
                };
                var data = {
                    list:res.presale_coupons
                }
                if (res.presale_coupons.length==0) {
                    $("#presaleCouponList").hide();        
                } else{
                    var html = template('presaleCouponT', data);
                    $("#presaleCouponList").empty().append(html);
                };
                var html = template('deliveryModeT', res.ticket);
                $("#deliveryMode").empty().append(html);

                var html = template('orderDetailBoxT', res);
                $("#orderDetailBox").empty().append(html);
            } else{
                layer.open({
                    content: '出错了',
                    time: 1
                });
            };

            if (res.ticket.express_mode == '0') {//是否支持快递0不支持1支持
                LS.set("delivery_mode", '1');//delivery_mode 0快递 1现场取票
                $('.tabBody').hide();
                $('#fetchWrapper').show();
            }
            if (res.ticket.express_mode == '0' && res.ticket.site_mode == '0') {
                LS.set("delivery_mode", '2');
                $('.tabBody').hide();
                $('#fetchWrapper').show();
            }
            if (res.ticket.express_mode == '0' && res.ticket.site_mode == '0' && res.ticket.electronic_mode != '1') {
                LS.set("delivery_mode", '0');
                $('#fetchWrapper').hide();
                $('#expressWrapper').show();
            }
            var ticket=res.ticket;
            var ticketObj=LS.set("ticketObj",JSON.stringify(res.ticket));
            creatOrderDetail(LS.get("buynumber")); 
        }

        var beforeFn = function() {
        }

        var afterFn = function() {            
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

    function creatOrderDetail(buynumber) {
        //var buynumber = 1;
        //
        //根据购买数量计算折扣
        //计算下是否已经超过了限购或者
        buynumber = buynumber || LS.get("buynumber");
        ticketObj = JSON.parse(LS.get("ticketObj"));
        /*if (buynumber > ticketObj.buy_limit && ticketObj.buy_limit != 0) {
            layer.open({
                content: "该产品限购" + ticketObj.buy_limit + "张",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            return;
        }*/
   //      if (buynumber > ticketObj.inventory) {
			// $(".aBtn").css("background","#ccc");
			// $(".aBtn").attr("data-action","");
   //          layer.open({
   //              content: "已经超过库存啦",
   //              time: 1
   //          })
   //          return;
   //      }

        var presaleCouponList = [];
        var presaleTotalMoney = 0;
        if(LS.get('presaleCouponList')){
            presaleCouponList = JSON.parse(LS.get('presaleCouponList'));
        }
        if(LS.get('presalTotalMoney')){
            presaleTotalMoney = parseFloat(LS.get('presalTotalMoney'));
        }
        // if(is_presale > 0){
        //     if(buynumber >　presale_coupon_codes.length){
        //         layer.open({
        //             content: "最多购买"+ presale_coupon_codes.length + "张",
        //             time: 1
        //         })
        //         return;
        //     }
        // }
        $(".presalecouponlist").find('li').attr('class','clearfix');
        $(".presalecouponlist").find('li').each(function(index,obj){
            for(var i in presaleCouponList){
                if($(this).attr('data-presale-coupon-id') == presaleCouponList[i]){
                    $(this).attr('class','clearfix active');
                }
            }

        });
        $("#buynumber").text(buynumber);
        orderData.number = buynumber;
        LS.set("orderNumber", buynumber);

        buynumber = buynumber || LS.get("orderNumber") || 0;
        var discountNum = -1;
        var discount = 10;
        var newArr = ticketDiscount.concat();
        newArr.push(buynumber)
        var sortArr = newArr.sort(function(a, b) {
            return a > b ? 1 : -1
        })
        var index = $.inArray(buynumber, sortArr);
        //alert(index);
        if (index > 0 && sortArr[index] != sortArr[index + 1]) {
            discountNum = Math.min(sortArr[index - 1], sortArr[index])
        } else if (index > 0 && sortArr[index] == sortArr[index + 1]) {
            discountNum = sortArr[index];
        } else if (index == 0) {
            if (sortArr[index] == sortArr[index + 1]) {
                discountNum = sortArr[index];
            }
        };
        if (ticketObj.discount) {
            for (var j = 0; j < ticketObj.discount.length; j++) {
                if (ticketObj.discount[j].number == discountNum) {
                    discount = ticketObj.discount[j].discount;
                    break;
                }
            }
        }

        if (discount >= 10) {
            $("#discount").hide();
        } else {
            $("#discount").show();
        }
        $("#discount").text(discount + "折");
        var express_price = 0;
        if (ticketObj.express_price){
            //LS.set('expressPrice', ticketObj.express_price);
            express_price = ticketObj.express_price;
        }
        else{
            express_price = 0;
        }            
        couponMoney = LS.get("couponMoney") || 0;
        //var express_price = express_price;
        if (LS.get('delivery_mode') == '1' || LS.get('delivery_mode') == '2') {
            express_price = 0;
        }
        amount = buynumber * Number(ticketObj.selling_price) * discount / 10 + Number(express_price) - couponMoney - presaleTotalMoney;
        $("#countPrice").text((buynumber * ticketObj.selling_price * discount / 10).toFixed(2));        
        var orderDetail = {
            ticket: ticketObj,
            express_price: express_price,
            buynumber: buynumber,
            order_money: ticketObj.selling_price,
            coupon_money: couponMoney,
            presale_money : presaleTotalMoney,
            amount: amount
        }
        var html3 = template("orderDetailBoxT", orderDetail);
        $("#orderDetailBox").empty().append(html3);
    }
    function bindEvents() {
        //var $buyNumEle = $("#buynumber");
        var eventsObj = {
            // "minusNum": function() {
            //     buynumber = parseInt($("#buynumber").text()) - 1 >= 1 ? parseInt($("#buynumber").text()) - 1 : 1;
            //     var presaleCouponList = [];
            //     if(LS.get('presaleCouponList')){
            //         presaleCouponList = JSON.parse(LS.get('presaleCouponList'));
            //     }
            //     if(buynumber < presaleCouponList.length){
            //         layer.open({
            //             content: "选择的预售券太多了",
            //             style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
            //             time: 1
            //         })
            //         return;
            //     }
            //     creatOrderDetail(buynumber);
            // },
            // "addNum": function() {                
            //     buynumber = parseInt($("#buynumber").text()) + 1 <= 500 ? parseInt($("#buynumber").text()) + 1 : 500;
                
            //     if (buynumber > ticketObj.inventory) {
            //         layer.open({
            //             content: "已经超过库存啦",
            //             time: 1
            //         })
            //         return;
            //     }
            //     creatOrderDetail(buynumber);

            // },
            "selectPresaleCoupon" : function(){
                var presaleCouponList = [];
                var newPresaleCouponList = [];
                var presalTotalMoney = 0;
                if(LS.get('presalTotalMoney')){
                    presalTotalMoney = parseFloat(LS.get('presalTotalMoney'));
                }
                if(LS.get('presaleCouponList')){
                    presaleCouponList = JSON.parse(LS.get('presaleCouponList'));
                }
                var presaleCouponId = $(this).data("presale-coupon-id");
                var presaleCouponMoney = parseFloat($(this).data("presale-coupon-price"));
                if ($(this).hasClass("active")) {
                    // if(is_presale == 1 && presaleCouponList.length > 0){
                    //     if(presaleCouponList.length == 1){
                    //         return;
                    //     }
                    // }
                    for(var i in presaleCouponList){
                        if(presaleCouponList[i] != presaleCouponId){
                            newPresaleCouponList.push(presaleCouponList[i]);
                        }
                    }
                    LS.remove("presaleCouponList");
                    LS.remove("presalTotalMoney");
                    LS.set('presaleCouponList',JSON.stringify(newPresaleCouponList));
                    presalTotalMoney = presalTotalMoney - presaleCouponMoney;
                    LS.set("presalTotalMoney", presalTotalMoney);
                }else{
                    buynumber = 1;
                    buynumber = LS.get("buynumber") || buynumber;
                    presaleCouponList.push(presaleCouponId);
                    if(buynumber < presaleCouponList.length){
                        layer.open({
                            content: "选择的预售券太多了",
                            style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                            time: 1
                        })
                        return;
                    }
                    presalTotalMoney = presalTotalMoney + presaleCouponMoney;
                    LS.set("presaleCouponList", JSON.stringify(presaleCouponList));
                    LS.set("presalTotalMoney", presalTotalMoney);
                }
                creatOrderDetail();
            },
            "selectCoupon": function() {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    LS.remove("couponId");
                    couponMoney = 0;
                    LS.set("couponMoney", couponMoney);
                    creatOrderDetail();
                    return;
                }
                couponMoney = $(this).data("coupon-money");
                limitMoney = $(this).data('coupon-limit-money');

                //判断是否会使用
                if (couponMoney > amount) {
                    layer.open({
                        content: "订单金额太小，不能使用该代金券",
                        style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                        time: 1,
                    })
                    return;
                }
                if(limitMoney && limitMoney > amount){
                    layer.open({
                        content: "消费满"+limitMoney+"才能够使用",
                        style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                        time: 1,
                    })
                    return;
                }

                var couponId = $(this).data("coupon-id");
                LS.set("couponId", couponId);
                LS.set("couponMoney", couponMoney);
                $(this).siblings().removeClass("active").end().addClass("active");
                creatOrderDetail();
            },
            "setDefaultAddress": function() {
                var data = {
                    _vt: LS.get("_vt"),
                    id: $(this).data("address-id")
                }
                setDefaultAddress(data, $(this));
            },
            "deleteAddress": function() {
                var that = this;
                var data = {
                    _vt: LS.get("_vt"),
                    id: $(this).data("address-id")
                }
                layer.open({
                    content: '确认删除该地址？',
                    btn: ['确认', '取消'],
                    shadeClose: false,
                    yes: function() {
                        layer.closeAll();
                        deleteAddress(data, $(that).parents("li"));
                    },
                    no: function() {

                    }
                });

            },
            "editAddress": function() {
                var address_id = $(this).data("address-id");
                LS.set("editAddressId", address_id);
                var data = {
                    id: address_id
                }
                $(".deleteAddress").attr("data-address-id", address_id);
                getAddress(data);
            },
            "selectDelivery": function() {                
                var delivery_mode = $(this).data("type");
                if (delivery_mode == '1' || delivery_mode == '2') {
                    LS.set('expressPrice', 0)
                } else {
                    LS.set('expressPrice', ticketObj.express_price);
                }
                if (delivery_mode == '2') {
                    $('.ok_tips').html('提示：支付成功后，将收到手机短信，凭短信领取电子票二维码。如有疑问请联系客服。');
                };
                if (delivery_mode == '1') {
                    $('.ok_tips').html('提示：支付成功后，凭身份证到演出地点取票，如有疑问请联系客服。');
                };
                LS.set("delivery_mode", delivery_mode);

                var me = $(this);
                if (!me.hasClass('.active')) {
                    $('.tabTag').removeClass('active');
                    me.addClass('active');
                    $('.tabBody').hide();
                    var selector = '#' + me.data('tab-target');
                    $(selector).show();
                }               
                creatOrderDetail();
            },
            "selectPayType": function() {
                var pay_type = $(this).data("type");
                LS.set("payType", pay_type);
                $(this).siblings().removeClass("active").end().addClass("active");
            },

            "addOrder": function() {
                addOrder();
            },
            "giftcont":function(){
                var id = $(this).data("id");
                window.location.href = "/goodDetail.html?id=" + id;
            },
            "goBack": function() {
                if (/active/.test(document.referrer)) {
                    window.history.back();
                } else {
                    window.location.href = "./order.html";
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

    function query_ticket(data) {
        var APIData = API.Detail.query_ticket;
        var params = util.toQueryParams();
        var successFn = function(res) {
            var data = {
                list: res.areas
            };
            for(var i in res.areas){
                var tlist = res.areas[i].tickets;
                for(var j in tlist){
                    if(tlist[j].uuid == params.id){
                        data = {
                            'user_id':LS.get('userId'),
                            'is_presale' : tlist[j].is_presale,
                            'commodity_codes':tlist[j].presale_coupon_codes
                        };
                        is_presale = tlist[j].is_presale;
                        if(tlist[j].presale_coupon_codes.length > 0){
                            query_ticket_presale_coupons({'_vt':LS.get('_vt'),'commodity_codes':tlist[j].presale_coupon_codes});
                            presale_coupon_codes = tlist[j].presale_coupon_codes;
                        }else{
                            $("#presaleCouponList").hide();
                            creatOrderDetail();
                        }

                    }
                }
            }
        }

        var beforeFn = function() {
        }

        var afterFn = function() {
            loadding.removeAll();
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
    function init() {
        LS.remove("addressId");
        LS.set("selectedAddress", 0);
        LS.remove("couponId");
        LS.remove("couponMoney");
        LS.remove("presalTotalMoney");
        LS.remove("presaleCouponList");
        var params = util.toQueryParams();
        renderOrder2({'ticket_id' :params.id,'ticket_number':LS.get("buynumber") ? LS.get("buynumber"):'1','_vt': LS.get("_vt")});
        getAddress();
        bindEvents();

        var fileds = [{
            name: 'customer_name',
            rules: 'required'
        }, {
            name: 'customer_mobile',
            rules: 'required|mobile'
        }, {
            name: 'identification',
            rules: 'required|identification'
        }];
        validatorForm('fetchForm', fileds, addOrder);
        var fileds = [{
            name: 'name',
            rules: 'required'
        },{
            name: 'mobile',
            rules: 'required|mobile'
        },{
            name: 'province_code',
            rules: 'required'
        },{
            name: 'city_code',
            rules: 'required'
        },{
            name: 'area_code',
            rules: 'required'
        }, {
            name: 'address',
            rules: 'required'
        }];
        validatorForm('addAddressForm', fileds, addAddress);
        fca(3, "addfcaSelect", {});
        validatorForm('editAddressForm', fileds, editAddress);
        util.initTab($('.tabWrapper'));
        LS.set("delivery_mode", '0');

        LS.set("orderNumber", LS.get("buynumber") ? LS.get("buynumber"):'1');
        LS.set("couponMoney", 0);
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
        };        
    }
    var orderData = {};
    var addressList = [];
    var presale_coupon_codes = [];
    var is_presale = 0;
    orderData.number = 1;

    ticketDiscount = [];
    var couponMoney = 0;
    init();
})