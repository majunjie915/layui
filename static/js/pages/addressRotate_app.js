define(function(require, exports) {
    var $ = require("jquery");
    var ajax = require("mod/common/ajax");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");

    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage")
    var scroll = require("mod/common/scroll");
    var util = require("mod/common/util");

    var loadding = require("site/loadding.js");

    var layer = require("mod/common/layer");

    var loaddedPage = 1;
    var continueLoad = true;

    function get_list(data) {
        if (!continueLoad) return false;
        var APIData = API.Address.get_my_address;
        data = data || {};
       // data.page = loaddedPage;
        data.user_id = user_id;
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
            //window.location.reload();
            history.go(0);
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
                $.ajax({
                    url : API.adomain+'/v3/lottery/hits',
                    type : 'put',
                    dataType : 'json',
                    data : {id:id,address_id:$(this).data("address-id")},
                    success : function(){
                        alert("您的信息已确认，小唯客服将于2个工作日内联系您领奖事宜！再次恭喜！若未及时联系，可在app中联系客服确认。");
                        location.href = '/dist/activity/rotate2/rotate_app.php?user_id='+user_id;
                    }
                });
            },
            "deleteAddress": function() {

                var data = {
                    user_id: user_id,
                    id: $(this).data("address-id")
                }
                // layer.open({
                //     content: '确认删除该地址？',
                //     btn: ['确认', '取消'],
                //     shadeClose: false,
                //     yes: function() {
                //         layer.closeAll();
                //         deleteAddress(data);
                //     },
                //     no: function() {
                        
                //     }
                // });
                //alert("确认删除该地址？");
                deleteAddress(data);                
            },
            "editAddress": function() {
                var address_id = $(this).data("address-id");
                var rotate = util.toQueryParams();
                rotate_id = rotate.id;

                LS.set("editAddressId",address_id);
                window.location.href = "./editAddressRotate_app.html?id="+rotate_id+"&user_id="+user_id;
            },
            "addAddress": function() {
                var address_id = $(this).data("address-id");
                var rotate = util.toQueryParams();
                rotate_id = rotate.id;

                LS.set("editAddressId",address_id);
                window.location.href = "./addAddressRotate_app.html?id="+rotate_id+"&user_id="+user_id;
            }
        }

        E.actionMap("body", eventsObj);
    }


    function init() {
        var params = util.toQueryParams();
        console.log(params);
        id = params.id;
        user_id = params.user_id;
        if(!user_id){
            alert('请先登录');
            window.location.href = "/logon.html";
            return;
        }
        var data = {
            user_id: user_id || ""
        }
        get_list(data);
        bindEvent();
        var scrollObj = {
            //pullUpFn: get_list
        }
        myScroll = scroll(scrollObj);
    }

    $("#addaddress").on('click',function(){
        //location.href = 'addAddressRotate.html?user_id='+user_id;
        window.location.href = "./addAddressRotate.html?id="+id+"&user_id="+user_id;
    });

    var $listEle = $("#addressList");
    var id;
    var user_id;
    init();
})