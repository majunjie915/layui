define(function(require, exports) {    
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    
    //require("pwgmodal");
    /*var scroll = require("mod/common/scroll");*/
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");

    //var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");

    //var loaddedPage = 1;
    //var continueLoad = true;
    //var myScroll;
    var get_list = function(data) {
        var APIData = API.Package.getPackage;
        data = data || {};
        var successFn = function(res) {            
            var data = {
                list: res.tickets
            };
            if (data) {
                var html = template('lists', data);
                $("#pkgList").html(html);
            }

            // var inventory = $(".pkgListBto>a").data("inventory");
            // if (inventory=="0") {
            //     $("#buyNow").hide();
            //     $("#soldOut").show();
            // }
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
            "shoppingInfo":function(){
                var id = $(this).data("id");
                var img_src = $(this).find("img").attr("src");
                if (img_src!="../static/images/noFuc.png") {
                    window.location.href = "/goodDetail.html?id=" + id;
                }
            }
        }
        E.actionMap("body", eventsObj);
    }

    function init() {
        var params = util.toQueryParams();
        var scene_id=params.scene_id;
        var data={
            scene_id:scene_id,
            _vt:LS.get('_vt')
        }
        get_list(data);
        bindEvent();
    }
    init();
    
})