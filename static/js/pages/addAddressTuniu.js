define(function(require,exports){
	var $ = require("jquery");
	var API = require("API");
	var ajax = require("mod/common/ajax");
	var E = require("mod/common/event");
	var validatorForm = require("mod/common/validatorForm");
	var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var fca = require("mod/common/fca_tuniu");
    var layer = require("mod/common/layer");

	function addAddress(form){
		var APIData = API.tuniu.tuniu_RegUserinfo;
		var form = $("[name='" + form + "']");		
		var data  = util.fromDataToJSON(form,true);
        	data.uuid = LS.get("userId");
		var province_select = $(".province_select option:selected").text();
		var city_select = $(".city_select option:selected").text();
		var area_select = $(".area_select option:selected").text();
		var address = $("#address").val();		
		data.address = province_select+city_select+area_select+address;

		var successFn = function(res){			
			window.location.href="/activity/tuniu/ok.html"
		}
		var beforeFn = function() {
        }

        var afterFn = function() {
        }

		data={
			uuid:data.uuid,
			name:data.name,
			mobile:data.mobile,
			address:data.address
		}

		LS.set("tn_name", data.name);
		LS.set("tn_mob", data.mobile);			
		LS.set("tn_address", data.address);

		var obj = {
			url:APIData.url,
			type:APIData.type,
			data:data || APIData.data,
			beforeFn: beforeFn,
            afterFn: afterFn,
			successFn:successFn,

		}
		ajax(obj);
	}

	function init(){
		var userId = LS.get('userId');
        var imgId = LS.get('vcode');
        if(userId){
            $('#imgCont').html('');
            $('#imgCont').append('<img src="/static/images/activites/tuniu/'+imgId+'.jpg">');
        }else{
            alert('请先登录');
            location.href = '/log_tuniu.html';
        }

		var fileds = [ {
            name: 'name',
            rules: 'required'
        },{
            name: 'mobile',
            rules: 'required|mobile'
        },{
            name: 'province_code',
            rules: 'required'
        },{
            name: 'city_code',
            rules: 'required'
        },{
            name: 'area_code',
            rules: 'required'
        },{
            name: 'address',
            rules: 'required'
        }];
        validatorForm('addressForm',fileds,addAddress);
        fca(3,"fcaSelect",{});
	}

	init();
})