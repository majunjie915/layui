define(function(require, exports) {
    var $ = require("jquery");

    var layer = require("mod/common/layer");
    var ajax = require("mod/common/ajax");
    var template = require("template");
    var API = require("site/config");

    var tmpl = '<span>' +
        '     <select class="province_select" name="province_code" data-required="请选择省">' +
        '         <option value="">不限</option>' +
        '         {{each provincelist as value i}}' +
        '         <option value="{{value.name}}">{{value.name}}</option>' +
        '         {{/each}}' +
        '     </select>' +
        '</span>' +
        '<span>' +
        '     <select class="city_select" name="city_code" data-required="请选择市">' +
        '         <option value="">不限</option>' +
        '         {{each citylist as value i}}' +
        '         <option value="{{value.name}}">{{value.name}}</option>' +
        '         {{/each}}' +
        '     </select>' +
        '</span>' +
        '{{if type==3}}' +
        '<span>' +
        '     <select  class="area_select" name="area_code" data-required="请选择区县">' +
        '         <option value="">不限</option>' +
        '         {{each arealist as value i}}' +
        '         <option value="{{value.name}}">{{value.name}}</option>' +
        '         {{/each}}' +
        '     </select>' +
        '</span>' +
        '{{/if}}'

    function createSelect(type, id, obj, pca_code) {
        renderSelect(type, id, obj, pca_code);
    }

    function renderSelect(type, id, obj, pca_code) {
        if (obj) {
            var data = {
                type: type,
                //province_code: obj.province_code || '',
                provincelist: obj.provincelist || [],
                //city_code: obj.city_code || '',
                citylist: obj.citylist || [],
                //area_code: obj.area_code || '',
                arealist: obj.arealist || []
            }
        } else {
            data = {type:type};
        }

        var render = template.compile(tmpl);
        var html = render(data);
        $("#" + id).empty().append(html);

        $province_select = $("#" + id + " .province_select");
        $city_select = $("#" + id + " .city_select");
        $area_select = $("#" + id + " .area_select");

        if (!data.province_code) {
            setSelect(1, $province_select, null, pca_code);

            if (type > 1) {
                $province_select.bind("change", function() {
                    if ($city_select.length) {
                        setSelect(2, $city_select, $province_select.val());
                    }
                    $("input[name=province]").val($(this).find('option:selected').text());
                })
            }

            if (type > 2) {
                $city_select.bind("change", function() {
                    if ($area_select.length) {
                        setSelect(3, $area_select, $city_select.val());
                    }
                    $("input[name=city]").val($(this).find('option:selected').text());
                })
                $area_select.bind("change", function() {
                    $("input[name=area]").val($(this).find('option:selected').text());
                })
            }
        } else {
            $province_select.val(obj.province_code);
            $city_select.val(obj.city_code);
            $area_select.val(obj.area_code);
        }
    }

    function setSelect(type, ele, id) {
        var arg = arguments[3];
        if (arguments[3] && type == 1) {
            var selected_code = arguments[3].province;
        } else if (arguments[3] && type == 2) {
            var selected_code = arguments[3].city;
        } else if (arguments[3] && type == 3) {
            var selected_code = arguments[3].area;
        }

        var APIData, data;
        if (type == 1) {
            APIData = API.Common.getProvice;
            data = "";
        } else if (type == 2) {
            APIData = API.Common.getCity;
            data = "province_code=" + id
        } else if (type == 3) {
            APIData = API.Common.getArea;
            data = "city_code=" + id
        }
        var successFn = function(res) {
            ele.empty();
            ele.append("<option value=''>不限</option>");
            if (type == 2 && $area_select.length > 0) {
                $area_select.empty();
                $area_select.append("<option value=''>不限</option>");
            }
            for (var i = 0; i < res.length; i++) {
                ele.append("<option value=" + res[i].code + ">" + res[i].name + "</option>");
            }

            if (selected_code && type == 1) {
                ele.val(selected_code);
                setSelect(2, $city_select, selected_code, arg);
            }

            if (selected_code && type == 2) {
                ele.val(selected_code);
                setSelect(3, $area_select, selected_code, arg);
            }

            if (selected_code && type == 3) {
                ele.val(selected_code);
            }
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,

            successFn: successFn
        }
        ajax(obj);
    }

    return createSelect;
})