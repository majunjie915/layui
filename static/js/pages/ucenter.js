define(function(require, exports) {    
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var Swiper = require('swiper');

    require("site/template.helper");
    require("pwgmodal");
    //var scroll = require("mod/common/scroll");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    //var layer = require("mod/common/layer");

    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");

    var showModal = function() {
        $.pgwModal({
            target: '#modalContent',
            titleBar: false
        });
    }

    // var slideBody = function() {
    //     $('body').addClass('slidedBody');
    //     $('.pm-body').css('height', window.innerHeight).css('margin', 0);
    // }

    // var unSlideBody = function() {
    //     $('body').removeClass('slidedBody');
    // }
    function bindEvent() {
        var eventsObj = {
            "a": function() {
                showModal();
                slideBody();
                return;
            },
            "toPage": function() {
                var page = $(this).data("page");
                if (!LS.get("_vt")) {
                    var arr = [
                        'address',
                        'addAddress',
                        'collect',
                        'coupon',
                        'editAddress',
                        'order',
                        'orderConfirm',
                        'orderDetail',
                        'self',
                        'activities',
                        'invitation_index'
                    ]
                    if (($.inArray(page, arr) > -1) && !LS.get("_vt")) {
                        /*if (page != "index") {
                            layer.open({
                                content: '您还没有登录,请登录',
                                style: 'background-color:#09C1FF; color:#fff; border:none;',
                                btn: ['确定','取消'],
                                yes: function() {
                                   
                                }
                            });
                        }*/

                        window.location.href = "./logon.html";
                    }
                } else {
                    window.location.href = "./" + page + ".html";
                }

                return;
            }
        }
        E.actionMap("body", eventsObj);
    }

    function position() {
        var url = util.toQueryParams();

        var city_name = url.city_name ? url.city_name : '全国';
        /*if(LS.get("selectCityName")){
            city_name = LS.get("selectCityName") || '全国'
        }*/
        $('#cur_city').html(city_name);
    }

    function init() {
        if (LS.get("sourcetype")) {
            $("#download").hide();
            $("#yqhy").hide();
        }else{
            $("#download").show();
            $("#yqhy").show();
        }
        if (LS.get("_vt")) {
            $("#logon").show();
            $("#notlogon").hide();
            if (LS.get("user")) {
                var user = JSON.parse(LS.get("user"));
                $("#logon span").text(user.nick_name);

                //替换用户图像
                if (user.header) {
                    $("#logon img").attr("src", user.header)
                }
            }
        } else {
            $("#logon").hide();
            $("#notlogon").show();
        }
        bindEvent();      
    }
    init();
})
