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

    function query_ticket_presale_coupons(data) {
        var APIData = API.Coupons.get_ticket_presale_coupons;
        data = data || {};
        var successFn = function(res) {
            addressList = res.address;
            var data = {
                list: res.presale_coupons
            };
            if (!res.presale_coupons || res.presale_coupons.length === 0) {
                $("#presaleCouponList").hide();
            } else {
                presale_coupon_codes = res.presale_coupons;
                var html = template('presaleCouponT', data);
                $("#presaleCouponList").append(html);
            }
            creatOrderDetail();
        }

        var beforeFn = function() {
            //loadding.create($listEle, 1);
        }

        var afterFn = function() {
            //loadding.removeAll();
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

    function addOrder() {
        var APIData = API.Order.create_order;
        var presalecouponds = new Array();
        if (LS.get("delivery_mode") == '1') {
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
            }else if(!/^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(customer.customer_mobile)){
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
        var formObj = {
            customer_id: LS.get("userId"),
            address_id: addressId,
            source: "h5",
            pay_type: LS.get("payType") || 0,
            ticket_number: LS.get("orderNumber") || 1,
            ticket_id: orderData.ticket.uuid,
            coupon_id: LS.get("couponId") || "",
            delivery_mode: LS.get("delivery_mode"),
            customer_name: customer ? customer.customer_name : '' || "",
            customer_mobile: customer ? customer.customer_mobile : '' || "",
            customer_identification: customer ? customer.identification : '' || "",
            remarks : '',
            is_rsa: false
        }

        //if (LS.get("delivery_mode") == '0') {
            $(".presalecouponlist").find('li').each(function(index,obj){
                if($(obj).attr('class').indexOf('active') > -1){
                    presalecouponds.push($(obj).attr('data-presale-coupon-id'));
                }
            });
            formObj.presale_coupon_id = presalecouponds.join(',');
        //}
        console.log(formObj);


        if (LS.get("delivery_mode") !== '1' && !addressId) {
            layer.open({
                content: "请添加收货人信息",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })

            return;
        }
		loadding.create(1,1);
		$(".aBtn").css("background","#ccc");
		$(".aBtn").attr("data-action","");
        var data = {
            rsa_str: Encrypt.encrypt(formObj)
        };

        var successFn = function(res) {
            gotoPay(res);

            function gotoPay(res) {
                console.log(res);
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
        data.user_id = LS.get("userId");

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

                if (orderData.ticket.express_mode == "0") {
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
        data.user_id = LS.get("userId");
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
        data.user_id = LS.get("userId");

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

        data.user_id = LS.get("userId");
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

    function getCoupons(data) {
        var APIData = API.Coupons.get_coupons;

        data = data || {};

        var successFn = function(res) {
            var data = {
                list: res.coupon
            }
            if (!res.coupon || res.coupon.length === 0) {
                $("#couponList").hide();
            } else {
                var html = template('couponT', data);
                $("#couponList").append(html);
            }
        }


        data.user_id = LS.get("userId");

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
        var selectedArea = LS.get("selectedArea");
        var selectedTicket = LS.get("selectedTicket");
        console.log(program);
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
        console.log(selectedTicket , tickets);
        if (ticket && ticket.uuid) {
            var data = {};

            data.title = program.title;
            data.start_time = scene.start_time;
            data.city_name = scene.city.name;
            data.venue_name = scene.venue.name;
            data.areaname = area.name;
            data.ticket = ticket;
            data.discount = 10;
            ticketObj = ticket;
            console.log(data);
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
            console.log(selectedArea)
            console.log(scene);
            console.log(area);
            console.log(ticket);

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
			$(".aBtn").css("background","#ccc");
			$(".aBtn").attr("data-action","");
            layer.open({
                content: "已经超过库存啦",
                time: 1
            })
            return;
        }

        if(presale_coupon_codes.length > 0){
            if(buynumber >　presale_coupon_codes.length){
                layer.open({
                    content: "最多购买"+ presale_coupon_codes.length + "张",
                    time: 1
                })
                return;
            }
            $(".presalecouponlist").find('li').each(function(index,obj){
                if(index < buynumber){
                    $(this).attr('class','clearfix active');
                }else{
                    $(this).attr('class','clearfix');
                }
            });
        }

        $("#buynumber").text(buynumber);
        orderData.number = buynumber;
        LS.set("orderNumber", buynumber);

        buynumber = buynumber || LS.get("orderNumber") || 0;
        var discountNum = -1;
        var discount = 10;
        var newArr = ticketDiscount.concat()
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

        //alert(discount);
        if (discount >= 10) {
            $("#discount").hide();
        } else {
            $("#discount").show();
        }
        $("#discount").text(discount + "折");
        if (ticketObj.express_price)
            LS.set('expressPrice', ticketObj.express_price);

        couponMoney = LS.get("couponMoney") || 0;


        var express_price = LS.get('expressPrice') || 0;
        if (LS.get('delivery_mode') == '1') {
            express_price = 0;
        }
        amount = buynumber * Number(ticketObj.selling_price) * discount / 10 + Number(express_price) - couponMoney - (presale_coupon_codes.length > 0 ? presale_coupon_codes[0].price*buynumber : 0);
        $("#countPrice").text((buynumber * ticketObj.selling_price * discount / 10).toFixed(2));

        var orderDetail = {
            ticket: ticketObj,
            express_price: express_price,
            buynumber: buynumber,
            order_money: ticketObj.selling_price * buynumber * discount / 10,
            coupon_money: couponMoney,
            presale_money : presale_coupon_codes.length > 0 ? (presale_coupon_codes[0].price*buynumber) : 0,
            amount: amount
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

                //判断是否会使用
                if (couponMoney > amount) {
                    layer.open({
                        content: "订单金额太小，不能使用该代金券",
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
                    user_id: LS.get("userId"),
                    id: $(this).data("address-id")
                }
                setDefaultAddress(data, $(this));
            },
            "deleteAddress": function() {
                var that = this;
                var data = {
                    user_id: LS.get("userId"),
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
                if (delivery_mode == '1') {
                    LS.set('expressPrice', 0)
                } else {
                    LS.set('expressPrice', ticketObj.express_price);
                }
                LS.set("delivery_mode", delivery_mode);
                creatOrderDetail()
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
        console.log(params);
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
                            'commodity_codes':tlist[j].presale_coupon_codes
                        };
                        if(tlist[j].presale_coupon_codes.length > 0){
                            query_ticket_presale_coupons({'user_id':LS.get('userId'),'commodity_codes':tlist[j].presale_coupon_codes});
                            presale_coupon_codes = tlist[j].presale_coupon_codes;
                        }else{
                            creatOrderDetail();
                        }

                    }
                }
            }
        }

        var beforeFn = function() {
            //loadding.create($listEle, 1);
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
    function query_ticket_my(data) {
        var APIData = API.Detail.query_ticket;
        var params = util.toQueryParams();
        var dtd = $.Deferred();
        var successFn = function(res) {
            LS.set("ticketDetail", JSON.stringify(res.areas));
            LS.set("selectedArea", res.areas[0].uuid);
            dtd.resolve();
        }

        var beforeFn = function() {
            //loadding.create($listEle, 1);
        }

        var afterFn = function() {
            //loadding.removeAll();
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
        return dtd.promise();
    }

    function query_detail(data, isInit) {
        var dtd = $.Deferred();
        var APIData = API.Detail.query_detail;
        console.log(APIData);
        //判断是否为第一次查询
        isInit = isInit || false;

        var successFn = function(res) {
            if (!res.program || !res.program.scenes.length) {
                layer.open({
                    content: "该节目暂无场次,无法查看",
                    //time:2,
                    btn: ['确定'],
                    yes: function() {
                        window.history.go(-1);
                    }

                });
                return;
            }

            LS.set("programDetail", JSON.stringify(res.program));
            LS.set("selectedScene", res.program.scenes[0].uuid);
            dtd.resolve(res);
        }




        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
        return dtd.promise();
    }

    function init() {

        LS.remove("addressId");
        LS.set("selectedAddress", 0);
        LS.remove("selectedTicket");
        LS.set("selectedTicket", '9643a8a4fd7811e580c66c92bf2bf795');
        //LS.set('selectedScene','543de47efd7811e580c66c92bf2bf795');
        LS.remove("couponId");
        LS.remove("couponMoney");
        var params = util.toQueryParams();

        var data = {
            program_id: params.pid || ""
        }
        query_detail(data, true).done(function(data){
            var queryData = {
                scene_id: data.program.scenes[0].uuid
            };
            query_ticket_my(queryData).done(function(data){
                renderOrder();
                query_ticket({'scene_id' :params.scencid});
                //query_ticket_presale_coupons({'user_id':LS.get('userId'),''});
                getAddress();
                getCoupons();
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
                }, {
                    name: 'mobile',
                    rules: 'required|mobile'
                }, {
                    name: 'address',
                    rules: 'required'
                }];

                validatorForm('addAddressForm', fileds, addAddress);

                fca(3, "addfcaSelect", {});

                validatorForm('editAddressForm', fileds, editAddress);


                util.initTab($('.tabWrapper'));

                LS.set("delivery_mode", '0');
                if (orderData.ticket.express_mode == '0' && orderData.ticket.site_mode == '1') {
                    LS.set("delivery_mode", '1');
                    $('.tabBody').hide();
                    $('#fetchWrapper').show();
                }

                LS.set("orderNumber", 1);
                LS.set("couponMoney", 0);
                if (isWeiXin()) {
                    $("#alipay").hide();
                    LS.set("payType", "1");
                } else {
                    $("#weixinpay").hide();
                    LS.set("payType", "0");
                }
            });
        });

    }

    var orderData = {};
    var addressList = [];
    var presale_coupon_codes = [];
    orderData.number = 1;

    ticketDiscount = [];
    var couponMoney = 0;
    init();
})