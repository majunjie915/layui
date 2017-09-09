define(function(require,exports){
	var $ = require("jquery");
	var API = require("API");
	var template = require("template");
	var ajax = require("mod/common/ajax");
	var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");

    function get_cities() {
        var APIData = API.group_cities;
        var data = data || {};

        var successFn = function(res) {
        	
            var selectCityCode = LS.get("selectCityCode") || 0
            var data = {
                list: res.cities,
                selectCityCode:selectCityCode
            };

            console.log(data.selectCityCode);

            var html = template('cityListT', data);
            $("#cityList").append(html);
            bindEvent()
            
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn,
        }

        console.log(data);

        ajax(obj);

    }
    
    function bindEvent() {
        var eventsObj = {
            "selectCity": function() {
                var city_code = $(this).data('code');
                var city_name = $(this).data('name');
                LS.set("selectCityCode",city_code);
                LS.set("selectCityName",city_name);
                //console.log(city_name)
                location.href="list.html?city_code=" + city_code + "&city_name=" + city_name+"&category_id="+LS.get("classify_id");
               
            }
        }
        E.actionMap("body", eventsObj);
    }

	function init(){
        get_cities();
	}

	init();
})