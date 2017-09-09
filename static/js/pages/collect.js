define(function(require, exports) {
    var $ = require("jquery");
    var ajax = require("mod/common/ajax");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
	var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");

    var scroll = require("mod/common/scroll");
	var util = require("mod/common/util");
    var loadding = require("site/loadding.js");
	var lazyLoad = require("mod/common/lazyLoad");
    var loaddedPage = 1;
    var continueLoad = true;
    var myScroll;

    function get_list(data) {
        if (!continueLoad) return false;
        var APIData = API.Collection.fetch;

        data = data || {};
        data.page = loaddedPage;

        var successFn = function(res) {
            console.log(res);
            var data = {
                list: res.programs
            };
            if (!res.programs || !res.programs.length) {
                continueLoad = false;
                if (loaddedPage == 1) {
                    $("#pullUp").hide();
                    $("#pullDown").hide();
                }
                return;
            } else {
                $listEle.find(".emptyWrapper").hide();
                var html = template('collectT', data);
                $listEle.append(html);

                myScroll.refresh();
            }
            loaddedPage++;
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


    }


    function init() {
        var data = {
            _vt: LS.get("_vt") || ""
        }
        get_list(data);
        //bindEvent();

        var scrollObj = {
            //spullUpFn: get_list
        }
        myScroll = scroll(scrollObj);
    }

    var $listEle = $("#collectList");

    init();
})