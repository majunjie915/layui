define(function(require,exports){
	var $ = require("jquery");
	var API = require("API");
	var ajax = require("mod/common/ajax");
	var E = require("mod/common/event");
	var validatorForm = require("mod/common/validatorForm");
	var layer = require("mod/common/layer");
	var LS = require("mod/common/localStorage");
	var util = require("mod/common/util");
	var fca = require("mod/common/fca");

	function updateAddress(form,id){
		var rotate = util.toQueryParams();
        var rotate_id = rotate.id;
		var APIData = API.Address.update_my_address;

		var successFn = function(){
			window.location.href="./addressRotate_app.html?id="+rotate_id+'&user_id='+user_id;
		}
		
		var form = $("[name='" + form + "']");
		var data  = util.fromDataToJSON(form,true);
        data.user_id = user_id;
        data.id = LS.get("editAddressId")||"";

		var obj = {
			url:APIData.url,
			type:APIData.type,
			data:data || APIData.data,
			successFn:successFn
		}

		ajax(obj);
	}

	function getAddress(data){
		var APIData = API.Address.get_my_address;

		var successFn = function(res){
			setForm(res.address[0]);
		}
		
		var obj = {
			url:APIData.url,
			type:APIData.type,
			data:data || APIData.data,
			successFn:successFn
		}

		ajax(obj);
	}

	function setForm(obj){
		$("input[name=name]").val(obj.name);
		$("input[name=mobile]").val(obj.mobile);
		$("textarea[name=address]").val(obj.address);

		var obj2 = {
			province: obj.province.code || '',
            city: obj.city.code || '',
            area: obj.area.code || '',
		}

		fca(3,"fcaSelect",null,obj2);
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
        validatorForm('addressForm',fileds,updateAddress);

        if(LS.get("editAddressId")){
        	var data  = {
        		//user_id : LS.get("userId").
        		id:LS.get("editAddressId")
        	}
        	getAddress(data);
        }else{
        	layer.open({
        		content:"没有要修改的地址",
        		style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
        		time:1
        	})
        }
	}
	var user_id;
	init();
})