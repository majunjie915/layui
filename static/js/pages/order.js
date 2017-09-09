define(function(require, exports) {
    var $ = require("jquery");
    var ajax = require("mod/common/ajax");
    var API = require("API");
    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");
    var template = require("template");
    require("site/template.helper");

    //var scroll = require("mod/common/scroll");

    var loadding = require("site/loadding.js");
    var Encrypt = require("mod/common/encrypt");

    var loaddedPage = 1;
    var continueLoad = true;
    //var myScroll;
    var page_size = 10;
    var inLoading = false;

    /*点击加载更多*/
    /*$(".loadMore").click(function(){
        page_size += 10;
        init();
    });*/

    function getViewport(){
        if (document.compatMode=="BackCompat") {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            };
        }else{
            return {
                width: document.documentEement.clientWidth,
                height: document.documentEement.clientHeight
            };
        }
    }

    window.onscroll = function(){
        var eleTop = $(".loadMore").get(0).getBoundingClientRect().top;
        var viewTop = getViewport().height;
        if (eleTop < viewTop) {
            init();
        }
    }
    
    function get_list(data) {
        if (!continueLoad) return false;
        if (inLoading) {
            return;
        }
        inLoading = true;
        $(".loadMore").text("拼命加载中...");
        var APIData = API.Order.order_list;

        data = data || {};
        data.page = loaddedPage;
        data.page_size = page_size;
        // data.id = LS.get("userId") || "";
        // data.is_rsa = false;
        // data = {
        //     rsa_str:Encrypt.encrypt(data)
        // };
        var successFn = function(res) {
            var data = {
                list: res.orders
            };
            // console.log(res.orders.commodity_type);
            if (!res.orders || !res.orders.length) {
                //continueLoad = false;

            } else {
                //$listEle.find(".emptyWrapper").hide();
                var html = template('orderT', data);
                if (res.pagination.current_page==1) {
                    $listEle.empty().append(html);    
                }else{
                    $listEle.append(html);
                }
                $(".loadMore").show();
                
                if (res.pagination.total < res.pagination.current_page*page_size) {
                    $(".loadMore").text("没有更多了");
                    continueLoad = false;
                    // $(".loadMore").unbind("click");
                }
            }
            loaddedPage++;
            inLoading = false;
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
            beforeFn: beforeFn,
            afterFn: afterFn,
            successFn: successFn
        }
        ajax(obj);
    }


    function bindEvent() {
        var eventsObj = {
            "orderDetail": function() {
                var orderId = $(this).attr("data-order-id");
                var type = $(this).attr("data-order-commodity-type");                
                
                if(type == "2"){
                    window.location.href = "./presaleOrderDetail.html?id=" + orderId;
                }else{
                    window.location.href = "./orderDetail.html?id=" + orderId;
                }
                
            }
        }

        E.actionMap("body", eventsObj);
    }


    function init() {
        if (LS.get("_vt")) {
           var data = {
            _vt: LS.get("_vt") || ""
            } 
        }else{
            LS.set("loginPage", window.location.href);
            location.href = "logon.html";
        };       

        get_list(data);
        
        bindEvent()

        var scrollObj = {
            // pullUpFn: get_list
        }
        //myScroll = scroll(scrollObj);

    }

    var $listEle = $("#orderList");

    init();
})