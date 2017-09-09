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
    var layer = require("mod/common/layer");
    var date = require("mod/common/date");

    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");

    var loaddedPage = 1;
    var continueLoad = true;
    var myScroll;
    var appkey = '23313321';


    function get_join_group(data) {

        var APIData = API.im.get_tribes;
        var successFn = function(res) {
            var nojoinlist = [];
            for(var i in joinedGroupList){
                for(var j in res.tribes){
                    if(joinedGroupList[i].tid == res.tribes[j].tid){
                        delete(res.tribes[j]);
                    }
                }
            }
            for(var i in res.tribes){
                nojoinlist.push(res.tribes[i]);
            }
            var data = {
                list: nojoinlist
            };
            if(data){
                var html = template('groupT', data);
                $("#joinList").empty().append(html);
            }
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            //afterFn: swipeBanner,
            successFn: successFn
        }
        ajax(obj);
    }

    function get_banners(data) {
        var APIData = API.Home.get_banners;

        var successFn = function(res) {
            var data = {
                list: res.banners
            };
            var html = template('bannerT', data);
            $("#bannerList").empty().append(html);
        }

        var swipeBanner = function() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                loop: true,
                autoplay: 5000,
                onTap: function(swiper, e) {
                    var target = $(e.target)
                    var link_url = target.data("link_url").trim();
                    if (link_url) {
                        window.location.href = link_url;
                        return;
                    }
                    var id = target.data("id");
                    if (id.length > 30)
                        window.location.href = "activeDetail.html?id=" + id;
                }
            });
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            afterFn: swipeBanner,
            successFn: successFn
        }

        ajax(obj);
    }



    var get_list = function(data) {
        if (!continueLoad) return false;

        var APIData = API.Home.get_home_data;
        data = data || {};
        var successFn = function(res) {
            var data = {
                list: res.programs
            };

            if (!res.programs || !res.programs.length) {
                /*
                if (loaddedPage == 1) {
                    //console.log("aaa");
                    var html = template('activeEmptyT', {});
                    $listEle.append(html);
                    $("#pullUp").hide();
                }
                continueLoad = false;
                $("#pullUp").find("span").text("没有更多了");
                $("#pullUp").attr("data-complete", true);
                */
                var html = template('activeEmptyT', {});
                $listEle.append(html);
                return;
            } else {
                $listEle.find(".emptyWrapper").hide();
                var html = template('activeT', data);
                //$('<div id="hiddenWarpEle" style="display:none"></div>').html(html).appendTo($('body'));
                $listEle.append(html);
                //myScroll.refresh();
                lazyLoad.lazyImgLodding();
            }
            var pcdata = {
                list: res.presale_coupons
            };
            if(pcdata){
                var html = template('couponsT', pcdata);
                $("#couponList").empty().append(html);
            }
            var bannerdata = {
                list: res.banners
            };
            var html = template('bannerT', bannerdata);
            $("#bannerList").empty().append(html);
			
			var activitydata = {
                list: res.recommended
            };
            var html = template('huodongT', activitydata);
            $("#huodong").empty().append(html);
            //loaddedPage++;
        }

        var beforeFn = function() {
            //loadding.create($listEle, 1);
        }

        var afterFn = function() {
            //loadding.removeAll();
            swipeBanner();
        }

        var swipeBanner = function() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                loop: true,
                autoplay: 5000,
                onTap: function(swiper, e) {
                    var target = $(e.target)
                    var link_url = target.data("link_url").trim();
                    if (link_url) {
                        window.location.href = link_url;
                        return;
                    }
                    var id = target.data("id");
                    if (id.length > 30)
                        window.location.href = "activeDetail.html?id=" + id;
                }
            });
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



    var showModal = function() {
        $.pgwModal({
            target: '#modalContent',
            titleBar: false
        });
    }

    var slideBody = function() {
        $('body').addClass('slidedBody');
        $('.pm-body').css('height', window.innerHeight).css('margin', 0);
    }

    var unSlideBody = function() {
        $('body').removeClass('slidedBody');
    }


    function joingroup(data){
        var APIData = API.im.join_tribe_users;

        var successFn = function(res) {
            console.log(res);
            layer.open({
                content: '已成功加入',
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
				time:1,
                //btn: ['确定','取消'],
                //yes: function() {}
            });
			window.location.reload();
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            //afterFn: swipeBanner,
            successFn: successFn
        }
        ajax(obj);
    }


    function bindEvent() {
        var eventsObj = {
            "a": function() {
                showModal();
                slideBody();
                return;
            },
            'join' : function(){
                if (LS.get("userId")) {
                    var tid = $(this).attr('data-groupid');
					var uid = "imuser_"+LS.get('userId');
                    joingroup({'uid':uid,'tribe_id':tid});
                }else{
                    layer.open({content: '您还没有登录,请登录',});
					window.location.href = "./logon.html";
                }

            },
            'entergroup' : function(){
                var tid = $(this).attr('data-groupid');
                var name = $(this).attr('data-groupnane');
                location.href = 'group.html?id='+tid+'&name='+name;
            },
            "toPage": function() {
                var page = $(this).data("page");
                if (!LS.get("userId")) {
                    var arr = [
                        'address',
                        'addAddress',
                        'collect',
                        'coupon',
                        'editAddress',
                        'order',
                        'orderConfirm',
                        'orderDetail',
                        'self'
                    ]
                    if (($.inArray(page, arr) > -1) && !LS.get("userId")) {
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

    function loginIm(uuid,appkey,pwd){
        var dtd = $.Deferred();
        sdk.Base.login({
            uid:uuid,
            appkey: appkey,
            credential: pwd,
            timeout: 4000,
            success: function(data){
                //sdk.Base.startListenAllMsg();
                dtd.resolve(data);
            },
            error: function(error){
                dtd.reject(error);
            }
        });
        return dtd;
    }

    function getGroupList(){
        var dtd = $.Deferred();
        sdk.Tribe.getTribeList({
            tribeTypes: [0,1,2],
            success: function(data){
				//console.log(data);
                dtd.resolve(data.data);
            },
            error: function(error){
                dtd.reject(error);
            }
        });
        return dtd.promise();
    }

    function historyMsg(groupid,nextkey,count){
        var dtd = $.Deferred();
        nextkey = nextkey || '';
        count = count || 20;
        sdk.Tribe.getHistory({
            tid: groupid,
            //count: count,
            //nextkey: nextkey,
            success: function(data){
                data.tid = groupid;
                dtd.resolve(data);
            },
            error: function(error){
                dtd.reject(error);
            }
        });
        return dtd.promise();
    }

    function init() {
        bindEvent();
        get_join_group();
        if (LS.get("userId")) {
            console.log('IMUser_'+LS.get('userId'),appkey,util.md5('IMpass_'+LS.get('userId')));
            loginIm('IMUser_'+LS.get('userId'),appkey,util.md5('IMpass_'+LS.get('userId'))).done(function(data){
                LS.set('imuser',JSON.stringify(data));
                getGroupList().done(function(glist){
                    joinedGroupList = glist;
                    get_join_group();
                    for(var i in glist){
                        historyMsg(glist[i].tid).done(function(mdata){
                            if(mdata.resultText == 'SUCCESS'){
                                for(var j in glist){
                                    if(glist[j].tid == mdata.tid){
                                        glist[j].msgCount = mdata.data.msgs.length ? mdata.data.msgs.length : 0;
                                        if(mdata.data.msgs.length > 0){
                                            mdata.data.msgs[0].date = date.unix2str(mdata.data.msgs[0].time);
                                            glist[j].msg = mdata.data.msgs[0];
                                        }
                                    }
                                }
                            }
                        })
                    }
                    var gdata = {
                        list : glist,
                    }
                    console.log(glist);
                    var html = template('mygroupT', gdata);
                    $("#myGroupList").empty().append(html);
                })
            }).fail(function(err){
                console.log(err);
            })
        } else {
            //layer.open({content: '您还没有登录,请登录',});
        }

        //sdk.Event.on('TRIBE.MSG_RECEIVED',function(data){
        //    console.log(data);
        //});
    }
    var joinedGroupList = [];
    var sdk = new WSDK();
    init();
})