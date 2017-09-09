define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    var ajax = require("mod/common/ajax");
    var util = require("mod/common/util");
    function query_content(data) {
        var APIData = API.Detail.query_program_desc;
        var successFn = function(res) {
            var regR = /\r/g;
            var regN = /\n/g;
            res.description = res.description.replace(regR, "<br/>");
            if (!res.description) {
                $(".activeContentNo").show();
            } else{
                $(".activeContentNo").hide();
                var html = template('activeContentT', res);
                $("#activeContent").append(html);
            };

            $("#activeContent img").attr("width","100%");             
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
        var params = util.toQueryParams();
        var data = {
            program_id:params.id
        }
        var isapp = params.isapp;
        if (isapp==1) {
            $(".header_nav").hide();
        } else{
            $(".header_nav").show();
        };
        query_content(data);       
    }
    init();
})

