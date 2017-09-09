define(function(require, exports) {
    var $ = require("jquery");
    var ajax = require("mod/common/ajax");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");

    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage")
    var scroll = require("mod/common/scroll");    

    var loadding = require("site/loadding.js");
    var layer = require("mod/common/layer");
    var loaddedPage = 1;
    var continueLoad = true;

    function get_list(data) {
        if (!continueLoad) return false;
        var APIData = API.Address.get_my_address;
        data = data || {};

        var successFn = function(res) {
            var data = {
                list: res.address
            };
            if (!res || !res.address.length) {
                continueLoad = false;
                if(loaddedPage==1){
                    $("#pullUp").hide();
                    $("#pullDown").hide();
                    $(".firstButton").hide();
                }
                return;
            } else {
                $listEle.find(".emptyWrapper").hide();
                var html = template('addressT', data);
                $listEle.append(html); 

                //显示列表中的添加按钮
                $('.addAddressBtn').show();

                myScroll.refresh();
            }
            loaddedPage ++;
        }

        var failFn = function(res) {
            //未获取到地址
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
            successFn: successFn,
            failFn:failFn
        }

        ajax(obj);
    }

    function deleteAddress(data) {
        var APIData = API.Address.delete_my_address;
        data = data || {};

        var successFn = function(res) {
            window.location.reload();
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }


        ajax(obj);
    }


    function setDefaultAddress(data) {
        var APIData = API.Address.change_default_address;
        data = data || {};
        data.page = loaddedPage;

        var successFn = function(res) {
            window.location.reload();
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
            "setDefaultAddress": function() {
                var data = {
                    _vt: LS.get("_vt"),
                    id: $(this).data("address-id")
                }
                setDefaultAddress(data);
            },
            "deleteAddress": function() {

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
                        deleteAddress(data);
                    },
                    no: function() {
                        
                    }
                });
                
            },
            "editAddress": function() {
                var address_id = $(this).data("address-id");

                LS.set("editAddressId",address_id);
                window.location.href = "./editAddress.html";
            }
        }

        E.actionMap("body", eventsObj);
    }


    function init() {
        var data = {
            _vt: LS.get("_vt") || ""
        }
        get_list(data);
        bindEvent()
        var scrollObj = {
            //pullUpFn: get_list
        }
        myScroll = scroll(scrollObj);
    }

    var $listEle = $("#addressList");

    init();
})