define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var lazyLoad = require("mod/common/lazyLoad");

    function get_hints(data) {
        var APIData = API.Search.hints;

        var successFn = function(res) {

            // $searchInput.val(res.hotwords[0].word);
            var arr = res.hotwords;
            var str = ""
            for (var i = 0, l = arr.length; i < l; i++) {
                str += '<li data-action="selectHotWord"><a href="javascript:;">' + arr[i].word + '</a></li>';
            }
            $("#hotRes").empty().html(str);
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

    function searchPrograms(key){
        $("#tabWrapper").hide();
        $(".activeList").show();
        $("#cancelSearch").show();
        $listEle.empty();
        setHistory(key);
    	var APIData = API.Search.programs;

        var successFn = function(res) {
            var data = {
                list: res.programs
            };
            if (res.programs && !res.programs.length) {
                continueLoad = false;
                 $(".emptyWrapper").show();
                return;
            }else if(res.pagination.current_page == 1 && ( !res.programs || res.programs.length==0)){
                $(".emptyWrapper").show();
            } else {
                $(".emptyWrapper").hide();
                var html = template('activeT', data);
                $listEle.append(html);

                lazyLoad.lazyImgLodding();
            }

        }
        var data ={
            key:key
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }
    // function cancelSearch(){
    //     $("#tabWrapper").show();
    //     $(".activeList").hide();
    //     $("#cancelSearch").hide();
    //     $(".emptyWrapper").hide();
    //     getHistorys();
    // }

    function getHistorys() {
        var historys = LS.get("historys");
        arr = historyArr = historys ? historys.split(HISTORYSPLIT) : [];
        var str = "";
        for (var i = 0, l = arr.length; i < l; i++) {
            str += '<li><a href="javascript:;" data-action="selectHistory">'+arr[i]+'</a><a class="clearHistoryBtn" href="javascript:;" data-action="clearHistory"><img src="../static/images/search/delete2x.png"></a></li>';
        }
        $("#historyRes ul").empty().html(str);
    }

    function setHistory(history) {
        if($.inArray(history,historyArr)<0){
            historyArr.push(history);
        }        
        LS.set("historys", historyArr);
    }

    function clearHistory(history){        
        historyArr.splice($.inArray(history,historyArr),1);
    	LS.set("historys",historyArr);
    }

    function clearAllHistory(){
        historyArr = [];
    	LS.remove("historys");        
    }

    function gotoPage(){
        $(".searchNav .cancelBtn").click(function(){
            var preUrl = document.referrer;
            if (preUrl.indexOf("list.html")>0) {
                location.href = "list.html";
            }else if(preUrl.indexOf("program.html")>0){
                location.href = "program.html";
            }else{
                location.href = preUrl.split("com")[0]+"com";
            }
        });
    }

    function bindEvents() {
        var eventsObj = {
            "cancelSearch": function(){
                $searchInput.val("");
            },
            "selectHotWord": function() {
                $searchInput.val($(this).text());
                searchPrograms($(this).text());
            },
            "getHistorys":function(){
                getHistorys();
            },
            "selectHistory": function() {
                $searchInput.val($(this).text());
                searchPrograms($(this).text());
            },
            "clearHistory":function(){
            	clearHistory($(this).parents("li").text());
            	$(this).parents("li").remove();
            },
            "clearAllHistory":function(){
            	clearAllHistory();
                $("#historyRes ul").empty();
            }
        }
        E.actionMap("body", eventsObj);

        /*var searchValue = $searchInput.val().trim();
        $searchInput.bind("keyup",function(e){
            var newSearchValue = $(this).val().trim();
            if(newSearchValue != searchValue){
                if (newSearchValue != "") {
                    searchPrograms(newSearchValue);
                }
                searchValue = newSearchValue;
            }
            if(e.keyCode==13 && newSearchValue != ""){
                searchPrograms(newSearchValue);
            }
        })*/
        $searchInput.bind("keyup",function(e){
            if(e.keyCode==13){
                searchPrograms($(this).val());
            }
        })
        $searchInput.blur(function(){
            if ($(this).val() != "") {
                searchPrograms($(this).val());
            }
        })
    }
    function init() {
        get_hints();
        getHistorys();
        gotoPage();
        bindEvents();
        util.initTab($('.tabWrapper'));        
    }
    
    var HISTORYSPLIT = ",";
    var historyArr;
    var $listEle = $(".activeList");
    var $searchInput = $("#searchInput");
    init();
})