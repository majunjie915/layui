define(function(require, exports) {
    var template = require("template");
    var myDate = require("mod/common/date")

    /**
     * 时间格式化
     * @param  {[type]} dateStr    时间戳
     * @param  {[type]} formatStr) 时间格式化 yyyy-MM-dd HH:mm:ss | W | w
     * @return {[type]}            [description]
     */
    template.helper("timeFormat", function(dateStr, formatStr) {
        if(!dateStr) return null;
        var unixTime = myDate.get_unix_time(dateStr);
        var newDate = new Date();
        newDate.setTime(unixTime);
        if (formatStr == "W") {
            return "周" + "日一二三四五六".charAt(newDate.getDay());
        }else if(formatStr == "w"){
        	return "星期" + "日一二三四五六".charAt(newDate.getDay());
        }
        return myDate.format(newDate, formatStr);
    })
    

    template.helper("toFixed2", function(num) {
        return Number(num).toFixed(2);
    })
    template.helper("toFixed", function(num) {
        if(Math.ceil(num)　> num){
            return num;
        }else{
            return Number(num).toFixed();
        }

    })
    template.helper("toNumber", function(num) {
        return Number(num);
    })
    template.helper("sexToString", function(num) {
        return num == 1? "男" : "女";
    })
    // 去掉城市最后的市字
    template.helper("toCity", function(city) {
        if(city.indexOf("市") > 0 ){
            return city.substring(0,city.indexOf('市'));
        }else{
            return city;
        }
        
    })
})