define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var util = require("mod/common/util");
    function query_refunds(data) {
        var APIData = API.Order.get_refunds;
        var successFn = function(res) {
            data = {
                list:res
            }
            var html = template('refundListT', data);
            $("#refundList").append(html);                   
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
            order_code:params.id
        }        
        query_refunds(data);       
    }
    init();
})

