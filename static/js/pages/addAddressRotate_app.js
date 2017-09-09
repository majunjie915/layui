define(function(require,exports){
	var $ = require("jquery");
	var API = require("API");
	var ajax = require("mod/common/ajax");
	var E = require("mod/common/event");
	var validatorForm = require("mod/common/validatorForm");
	var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var fca = require("mod/common/fca");
    var layer = require("mod/common/layer");

	function addAddress(form){
		var rotate = util.toQueryParams();
        var rotate_id = rotate.id;

		var APIData = API.Address.add_my_address;
		var form = $("[name='" + form + "']");
		var data  = util.fromDataToJSON(form,true);
        data.user_id = user_id;

		var successFn = function(){
			layer.open({
				content:"添加成功",
				style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
				time:1
			})
			window.location.href="./addressRotate_app.html?id="+rotate_id+'&user_id='+user_id;
		}

		

		var obj = {
			url:APIData.url,
			type:APIData.type,
			data:data || APIData.data,
			successFn:successFn
		}

		ajax(obj);
	}

	function init(){
		var params = util.toQueryParams();
		user_id = params.user_id;
		if(!user_id){
			alert('请先登录');
			window.location.href = "/logon.html";
			return;
		}
		var fileds = [ {
            name: 'name',
            rules: 'required'
        },{
            name: 'mobile',
            rules: 'required|mobile'
        },{
            name: 'address',
            rules: 'required'
        }];
        validatorForm('addressForm',fileds,addAddress);
        fca(3,"fcaSelect",{});
	}
	var user_id;

	init();
})