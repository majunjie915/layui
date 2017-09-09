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

    //var iScroll = require("lib/iscroll");

    function query_detail(data, isInit) {
        var APIData = API.fandom.get_tribes;

        var successFn = function(res) {
            if (!res.posts || !res.posts.length) {
                layer.open({
                    content: "该帖子不存在,无法查看",
                    //time:2,
                    btn: ['确定'],
                    yes: function() {
                        window.history.go(-1);
                    }
                });
                return;
            }
            //res.posts[0].text = res.posts[0].text.replace(/(\n)+|(\r\n)+/g, "<br/>");
            var regR = /\r/g;
            var regN = /\n/g;
            res.posts[0].text = res.posts[0].text.replace(regR, "<br/>").replace(regN, "<br/>");

            var html = template('postDetailT', res.posts[0]);
            $("#postDetail").append(html);
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
                if(scene.comment != ''){
                    $("#comment").show();
                    scene.comment = scene.comment.replace(/[\r\n]/g,"<br/>");
                    var html = template('commentT', {comment: scene.comment});
                    $("#comment").empty().append(html);
                }else{
                    $("#comment").hide();
                }



                //票品内容改变
                var queryData = {
                    scene_id: sceneId
                };

                query_ticket(queryData);
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
                if (!LS.get("userId")) {

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
                        query_ticket_presale_coupons({_vt:LS.get('_vt'),commodity_codes:ispresale},scencid,tid);
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

    function init() {
        var params = util.toQueryParams();
        program_id = params.id;
        var data = {
            user_id: params.user_id || "",
            last_created_at: params.last_created_at || "",
            id: params.id || "",
        }
        query_detail(data, true);
        bindEvents();
    }
    init();
})