define(function(require, exports) {
    var $ = require("jquery");
    var layer = require("mod/common/layer");

    var create = function(opt) {
    	layer.open({
            type: 2,
            style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
            //time: 3
        });
    }

    var remove = function(id) {
    	console.log("remove");
    }

    var removeAll = function(){
        layer.closeAll();
    }

    exports.create = create;
    exports.remove = remove;
    exports.removeAll = removeAll;
})