define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var ajax = require("mod/common/ajax");
    var validatorForm = require("mod/common/validatorForm");
    var util = require("mod/common/util");
    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");
    var params = util.toQueryParams();    
    function SignVerify(data){
        var APIData = API.User.kejianglogin;
        var successFn = function(res) {
            LS.set("kj_openuserid",params.open_userid);
            LS.set("kejiang_source",params.source);
            LS.set("_vt",res.token);
            LS.set("userId",res.user.id);
            LS.set("sourcetype",res.user.type);
            LS.set("user",JSON.stringify(res.user));
            window.location.href="./index.html";
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
        var data ={
            kejiang_source:params.source,
            open_userid:params.open_userid,
            phone:params.phone,
            sign:params.sign
        }
        SignVerify(data);
    }
    init();
})