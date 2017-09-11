/**
 * 网站公用的ajax处理函数
 * @author flyking
 * @date 2015-09-07
 */

layui.define([], function(exports) {

    var obj = {
        /**
         * 将字符串转化为字符串 dateStr格式为“2014-05-08 00:22:11”
         * @type {[type]}
         */
        get_unix_time: function(dateStr) {
            var newstr = dateStr.replace(/-/g, '/');
            var date = new Date(newstr);
            var time_str = date.getTime().toString();
            return time_str;
        },
        /**
         * 按照格式输出日期
         * 
         * @method format
         * @param source {Date} 时间对象
         * @param pattern {string} 时间格式
         */
        format: function(source, pattern) {
            if ('string' != typeof pattern) {
                return source.toString();
            }

            function replacer(patternPart, result) {
                pattern = pattern.replace(patternPart, result);
            }

            var pad = function(source, length) {
                var pre = "",
                    negative = (source < 0),
                    string = String(Math.abs(source));
                if (string.length < length) {
                    pre = (new Array(length - string.length + 1)).join('0');
                }
                return (negative ? "-" : "") + pre + string;
            }

            var year = source.getFullYear(),
                month = source.getMonth() + 1,
                date2 = source.getDate(),
                hours = source.getHours(),
                minutes = source.getMinutes(),
                seconds = source.getSeconds(),
                day = "日一二三四五六".charAt(source.getDay());

            replacer(/yyyy/g, pad(year, 4));
            replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
            replacer(/MM/g, pad(month, 2));
            replacer(/M/g, month);
            replacer(/dd/g, pad(date2, 2));
            replacer(/d/g, date2);

            replacer(/HH/g, pad(hours, 2));
            replacer(/H/g, hours);
            replacer(/hh/g, pad(hours % 12, 2));
            replacer(/h/g, hours % 12);
            replacer(/mm/g, pad(minutes, 2));
            replacer(/m/g, minutes);
            replacer(/ss/g, pad(seconds, 2));
            replacer(/s/g, seconds);

            replacer(/W/g, "周" + day);
            replacer(/w/g,"星期" + day);
            return pattern;
        },
        parse: function(source) {
            var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
            if ('string' == typeof source) {
                if (reg.test(source) || isNaN(Date.parse(source))) {
                    var d = source.split(/ |T/),
                        d1 = d.length > 1 ? d[1].split(/[^\d]/) : [0, 0, 0],
                        d0 = d[0].split(/[^\d]/);
                    return new Date(d0[0] - 0,
                        d0[1] - 1,
                        d0[2] - 0,
                        d1[0] - 0,
                        d1[1] - 0,
                        d1[2] - 0);
                } else {
                    return new Date(source);
                }
            }

            return new Date();
        },
        unix2time : function(timestampstr){
            var newDate = new Date();
            newDate.setTime(timestampstr);
            return newDate.toLocaleString(timestampstr)
        },
        unix2str : function(timestampstr){
            var newDate = new Date();
            newDate.setTime(timestampstr);
            var timestamp = parseInt(timestampstr);
            timestamp = isNaN(timestamp) ? 0 : timestamp;
            var thenT = new Date(timestamp);
            thenT.setHours(0);
            thenT.setMinutes(0);
            thenT.setSeconds(0);
            var nowtime = new Date();
            nowtime.setHours(0);
            nowtime.setMinutes(0);
            nowtime.setSeconds(0);
            var delt = Math.round((nowtime.getTime() - thenT.getTime()) / 1000 / 86400);
            var day_def = {
                '-2': '后天',
                '-1': '明天',
                '0': '今天',
                '1': '昨天',
                '2': '前天'
            }[delt.toString()] || ((delt >= -30 && delt < 0) ? Math.abs(delt) + '天后' : (delt > 0 && delt <= 30) ? delt + '天前' : newDate.toLocaleString(timestampstr));
            return day_def;
        }
    }
    exports("customDate", obj);

})