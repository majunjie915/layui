/**
 * 网站公用的
 * @author flyking
 * @date 2015-09-07
 */

define("mod/common/loadjs", [], function() {
    return function(url, callback) {
        function onload() {
            var readyState = script.readyState;
            if (typeof readyState == "undefined" || /^(loaded|complete)$/.test(readyState)) {
                script.onload = script.onreadystatechange = null;
                script = null;
                callback && callback()
            }
        }
        var script = document.createElement("script");
        script.async = true;
        if (script.readyState) {
            script.onreadystatechange = onload
        } else {
            script.onload = onload
        }
        script.src = url;
        var parent = document.getElementsByTagName("head")[0] || document.body;
        parent.appendChild(script) && (parent = null)
    }
});