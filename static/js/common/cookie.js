
/**
 * 网站公用的ajax处理函数
 * @author flyking
 * @date 2015-09-07
 */
define("mod/common/cookie", [], function() {
    $.cookie = {
        get: function(name, encode) {
            var arg = name + "=";
            var alen = arg.length;
            var clen = document.cookie.length;
            var i = 0;
            var j = 0;
            while (i < clen) {
                j = i + alen;
                if (document.cookie.substring(i, j) == arg) return this.getCookieVal(j, encode);
                i = document.cookie.indexOf(" ", i) + 1;
                if (i == 0) break
            }
            return null
        },
        getname: function(cookie_name, name) {
            var cookie_val = this.get(cookie_name);
            var regex = new RegExp("[?&]" + encodeURIComponent(name) + "\\=([^&#]+)");
            var value = (cookie_val.match(regex) || ["", ""])[1];
            return decodeURIComponent(value)
        },
        set: function(name, value, expires, path, domain, secure) {
            var argv = arguments;
            var argc = arguments.length;
            var now = new Date;
            var expires = argc > 2 ? argv[2] : new Date(now.getFullYear(), now.getMonth() + 1, now.getUTCDate());
            var path = argc > 3 ? argv[3] : "/";
            var domain = argc > 4 ? argv[4] : ".58.com";
            var secure = argc > 5 ? argv[5] : false;
            document.cookie = name + "=" + escape(value) + (expires == null ? "" : "; expires=" + expires.toGMTString()) + (path == null ? "" : "; path=" + path) + (domain == null ? "" : "; domain=" + domain) + (secure == true ? "; secure" : "")
        },
        remove: function(name) {
            if (this.get(name)) this.set(name, "", new Date(1970, 1, 1))
        },
        getCookieVal: function(offset, encode) {
            var endstr = document.cookie.indexOf(";", offset);
            if (endstr == -1) {
                endstr = document.cookie.length
            }
            if (encode == false) return document.cookie.substring(offset, endstr);
            else return unescape(document.cookie.substring(offset, endstr))
        }
    }
});