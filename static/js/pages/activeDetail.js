define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var E = require("mod/common/event");
    var ajax = require("mod/common/ajax");
    var validatorForm = require("mod/common/validatorForm");
    var LS = require("mod/common/localStorage");
    var loadding = require("site/loadding.js");
    var layer = require("mod/common/layer");
    var util = require("mod/common/util");
    //var iScroll = require("lib/iscroll");

    function query_program(data, isInit) {
        var APIData = API.Detail.query_program;
        //判断是否为第一次查询
        isInit = isInit || false;
        var successFn = function(res) {
            LS.set("programDetail", JSON.stringify(res.program));
            var html = template('programT', res);
            $("#programcont").append(html);
            var scenesData = {
                list:res.city_group
            }
            var html = template('sceneT', scenesData);
            $("#scenesList").append(html);            
            $(".no_activeList").show();
        }
        var beforeFn = function() {
        }
        var afterFn = function() {
            $(".pageLoadding").remove();
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

    function query_detail(data, isInit) {
        var APIData = API.Detail.query_detail;
        //判断是否为第一次查询
        isInit = isInit || false;
        var successFn = function(res) {

            LS.set("programDetail", JSON.stringify(res.program));
            LS.set("selectedScene", res.program.scenes[0].uuid);
            LS.set('selectedSceneDetail',JSON.stringify(res.program.scenes[0]));

            if (!res.program || !res.program.scenes.length) {
                layer.open({
                    content: "该节目暂无场次,无法查看",
                    //time:2,
                    btn: ['确定'],
                    yes: function() {
                        // window.history.go(-1);
                        window.location.href = "./index.html";
                    }

                });
                return;
            }
            var regR = /\r/g;
            var regN = /\n/g;
			// 关于他的演出 20160531
            if (res.program.description != '') {
                // res.program.description = res.program.description.replace(/(\n)+|(\r\n)+/g, "<br/>");                
                res.program.description = res.program.description.replace(regR, "<br/>");
                // res.program.description = res.program.description;
                var data2 = {
                    description: res.program.description
                };
                var html2 = template('descriptionT', data2);
                $("#description").append(html2);
            }
			// 新增特殊票品说明20160228
			if (res.program.scenes[0].comment.length) {
                // res.program.scenes[0].comment = res.program.scenes[0].comment.replace(/(\n)+|(\r\n)+/g, "<br/>");
                res.program.scenes[0].comment = res.program.scenes[0].comment.replace(regR, "<br/>");
                var data2 = {
                    comment: res.program.scenes[0].comment
                };
                var html2 = template('commentT', data2);
                $("#comment").append(html2);
			}      

            LS.set("programDetail", JSON.stringify(res.program));
            LS.set("selectedScene", res.program.scenes[0].uuid);
            LS.set('selectedSceneDetail',JSON.stringify(res.program.scenes[0]));

            var html = template('programT', res);
            $("#program").append(html);

            var html = template('scenceinfoT', res);
            $("#scenceinfo").append(html);
            
            var data = {
                list: res.program.scenes
            };

            var html = template('sceneT', data);
            $("#sceneList").append(html);
            if (isInit) {
                $("#sceneList li").eq(0).addClass('active');
            }			

            var queryData = {
                scene_id: res.program.scenes[0].uuid
            };
            query_ticket(queryData);
            // var $collectBtn = $(".collectBtn").eq(0);
            // $collectBtn.attr("data-program-id", res.program.uuid), $collectBtn.attr("data-scene-id", res.program.scenes[0].uuid);
            // query_content(res.program.scenes[0].content_id);            
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }
        ajax(obj);
    }

    // function query_content(id) {
    //     $.ajax({
    //         url: "http://static.vipiao.com/scene/content/" + id,
    //         data: {},
    //         type: 'get',
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         crossDomain: true,
    //     })
    //     .done(function(res) {
    //         $("#activeContent").html($("<div/>").html(res).html());
    //     }).fail(function(res) {

    //     })
    // }

    function query_ticket(data) {
        var APIData = API.Detail.query_ticket;
        var successFn = function(res) {
            LS.set("ticketDetail", JSON.stringify(res.areas));
            LS.set("selectedArea", res.areas[0].uuid);
            /*
            for(var i in res.areas[0].tickets){
                res.areas[0].tickets[i].description = res.areas[0].tickets[i].description.split('\r\n').join('<br/>');                
            }            
            
            var data = {
                list: res.areas
            };

            var html = template('ticketT', data);
            $("#ticketList").empty().append(html);
            */
            //$(".collectBtn").attr("data-program-id",res[0].id).attr("data-scene-id",res[0].scene_id)
		
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

    function query_ticket_presale_coupons(data,scencid,tid) {
        var APIData = API.Coupons.get_ticket_presale_coupons;

        var successFn = function(res) {
            if(!res.presale_coupons || res.presale_coupons.length > 0){
                layer.open({
                    time: 2,
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    content: '仅限有预售资格购买'
                })
                return;
            }
            if (tid.length == 32) {
                window.location.href = "./orderConfirm.html?id=" + tid +"&scencid="+scencid;
            } else {
                layer.open({
                    type: 1,
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    content: "票品id不合法"
                })
            }
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

    function bindEvents() {
        var eventsObj = {
            'close':function(){
                $('.pop_cont').hide().removeClass('pop_show');
                $('.mask').hide();
            },
            'btnBook':function(){
                var sid = $(this).data('scencid');
                var proid = $(this).data('programid');
                var city = $(this).data('city');
                var time = $(this).data('time');
                $('#selsid').val(sid);
                $('#selpid').val(proid);
                $('#pop_pro_tit').html(JSON.parse(LS.get('programDetail')).title);
                $('#scencity').html(city);
                $('#scentime').html(time);
                if (!LS.get("_vt")) {
                    $('#name').val();
                    $('#moblie').val();
                }else{
                    var userInfo = JSON.parse(LS.get('user'));
                    $('#name').val(userInfo.nick_name);
                    $('#moblie').val(userInfo.user_name);
                }
                $('.pop_cont').show().addClass('pop_show');                
                $('.mask').show();
            },            
            'addOrder' : function(){
                if (!LS.get("_vt")) {
                    LS.set("loginPage", window.location.href);
                    location.href = "logon.html";
                } else {
                    var scencid = $(this).data("scencid");
                    LS.set("selectedScene", scencid);
                    window.location.href = "./gobuy.html?scencid=" + scencid;
                }
            },
            
            'shareBtn' : function(){
                layer.open({
                    time: 2,
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    content: '请点击微信右上角分享哟~'
                })                
            },
            "selectScene": function() {
                var sceneId = $(this).data("scene-id");
                LS.set("selectedScene", sceneId);
                //顶部内容切换
                var program = JSON.parse(LS.get("programDetail"));

                var scenes = program.scenes,
                    l = scenes.length;
                var scene = {};

                for (var i = 0; i < l; i++) {
                    if (sceneId == scenes[i].uuid) {
                        scene = scenes[i];
                        break;
                    }
                }
                var data = {'program':{
                    'title': program.title,
                    'portrait_id': program.portrait_id,
                    'scenes': [scene]}
                }

                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');

                var html = template('programT', data);
                $("#program").empty().append(html);

                var html = template('scenceinfoT', data);
                $("#scenceinfo").empty().append(html);

                if(scene.comment != ''){
                    $("#comment").show();
                    scene.comment = scene.comment.replace(/[\r\n]/g,"<br/>");
                    var html = template('commentT', {comment: scene.comment});
                    $("#comment").empty().append(html);
                }else{
                    $("#comment").hide();
                }
                LS.set('selectedSceneDetail',JSON.stringify(scene));
                //票品内容改变
                var queryData = {
                    scene_id: sceneId
                };

                //query_ticket(queryData);
                //query_content(queryData);
            },
            "toggleTicket": function() {
                $(".areaTickets").hide();
                $("#ticketList section").removeClass("active");
                var areaId = $(this).data("area-id");
                console.log(areaId)
                LS.set("selectedArea", areaId);

                $(this).toggleClass("unfold");
                if ($(this).hasClass("unfold")) {
                    $(this).parent().removeClass("active");
                    $(this).next().hide();
                } else {
                    $(this).parent().addClass("active")
                    $(this).next().show();
                }
            },
            "buyTicket": function() {
                if (!LS.get("_vt")) {
                    LS.set("loginPage", window.location.href);
                    location.href = "logon.html";
                } else {
                    var scencid = $(this).attr('data-scene-id');
                    var tid = $(this).attr('data-ticket-id');
                    var tlist = JSON.parse(LS.get("ticketDetail"));
                    var ispresale = false;
                    for(var i in tlist){
                        var tl = tlist[i].tickets;
                        for(var j in tl){
                            if(tl[j].uuid == tid){
                                if(tl[j].presale_coupon_codes.length > 0){
                                    ispresale = tl[j].presale_coupon_codes;
                                }
                            }
                        }
                    }
                    LS.set("selectedTicket", tid);
                    if(ispresale){
                        query_ticket_presale_coupons({user_id:LS.get('userId'),commodity_codes:ispresale},scencid,tid);
                    }else{
                        var $that = $(this);
                        scencid = $(this).attr('data-scene-id');
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
                                    window.location.href = "/src/dist/activity/bigbang/index.php?userId="+LS.get("userId")+"&activityId="+$that.data("activity-id");
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

                        if (id.length == 32) {
                            window.location.href = "./orderConfirm.html?id=" + id + "&scencid=" + scencid;
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
            title: JSON.parse(LS.get('programDetail')).title, // 分享标题
            desc: JSON.parse(LS.get('programDetail')).title, // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: JSON.parse(LS.get('programDetail')).portrait_id, // 分享图标
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
    function booking () {
        var APIData = API.Detail.appointment;
        var data = {
            program_id:$("#selpid").val(),
            scene_id:$("#selsid").val(),
            name:$("#bookingForm [name=name]").val(),
            mobile:$("#bookingForm [name=mobile]").val()
        }
        var successFn = function(res) {
            $('.mask').hide();
            $('#pop').hide();
            layer.open({
                time: 2,
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                content: '登记成功！'
            });            
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }
        ajax(obj);
    }
    function init() {
        var fileds = [{
            name: 'name',
            rules: 'required'
        }, {
            name: 'mobile',
            rules: 'required|mobile'
        }];
        validatorForm('bookingForm',fileds,booking);
        LS.set('selectedSceneDetail',null);
        var params = util.toQueryParams();
        program_id = params.id;
        var data = {
            program_id: params.id || "",
            city_code: params.city || "",
        }
        query_program(data, true);
        bindEvents();        
        bootstrap();               
    }
    var program_id = '';
    init();
})