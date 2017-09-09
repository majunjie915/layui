define(function(require, exports) {
    var $ = require("jquery");

    function actionMap(box, actions, context) {
        box = $(box);
        $(".bodywarp").delegate(".bodyInner", 'click', function(e) {
            var node = e.target || e.srcElement;
            var action;

            // 向上查找，直到遇到第一个含有 data-action 属性的元素
            while (node && node.nodeType === 1) {
                action = node.getAttribute('data-action');
                if (action != null || node == box) break;
                node = node.parentNode;
            }


            if (actions && action && action in actions) {
                actions[action].call(node, getData(node, box));
            }
        });
        //pgwModal会将遮罩层置于body内，.bodyInner之外，所以代理不能将其绑定
        $("body").delegate("#pgwModal", 'click', function(e) {
            var node = e.target || e.srcElement;
            var action;

            // 向上查找，直到遇到第一个含有 data-action 属性的元素
            while (node && node.nodeType === 1) {
                action = node.getAttribute('data-action');
                if (action != null || node == box) break;
                node = node.parentNode;
            }

            if (actions && action && action in actions) {
                actions[action].call(node, getData(node, box));
            }
        });
    }

    // 从本元素或其祖先元素，提取数据
    function getData(node, box) {
        var data = {},
            hasData;
        var attrs = node.attributes;
        for (var i = 0, len = attrs.length; i < len; i++) {
            var name = attrs[i].nodeName;
            if (name.slice(0, 5) === 'data-' && name !== 'data-action-data') {
                data[name.slice(5)] = attrs[i].nodeValue.trim();
                hasData = true;
            }
        }
        return hasData ? data : null;
    }
    exports.actionMap = actionMap;
})