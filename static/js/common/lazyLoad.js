define(function(require, exports) {
	var $ = require("jquery");

    var PreLoad = function(a, b) {
        var c = b || {};
        this.source = a, this.count = 0, this.total = a.length, this.onload = c.onload, this.prefix = c.prefix || "", this.version = "?v=" + (c.version || "0.0.1"), this.init()
    };
    PreLoad.prototype.init = function() {
        var a = this;
        a.source.forEach(function(b) {
            var b_old = b;
            if (b_old instanceof Array) {
                b = b_old[1];
            }
            var c = b.substr(b.lastIndexOf(".") + 1).toLowerCase(),
                d = a.prefix + b + a.version;
            switch (c) {
                case "js":
                    a.script.call(a, d);
                    break;
                case "css":
                    a.stylesheet.call(a, d);
                    break;
                case "jpg":
                case "gif":
                case "png":
                case "jpeg":
                    {
                        if (b_old instanceof Array) {
                            a.image.call(a, d, b_old[0]);
                        } else {
                            a.image.call(a, d)
                        }
                    }

            }
        })
    }, PreLoad.prototype.getProgress = function() {
        return Math.floor(this.count / this.total * 100)
    }, PreLoad.prototype.image = function(a) {
        var b = document.createElement("img");
        //console.log(arguments.length)
        if (arguments.length == 2) {
            this.load(b, a, 'image', arguments[1]);
        } else {
            this.load(b, a, 'image');
        }
        b.src = a;
    }, PreLoad.prototype.stylesheet = function(a) {
        var b = document.createElement("link");
        this.load(b, a), b.rel = "stylesheet", b.type = "text/css", b.href = a, document.head.appendChild(b)
    }, PreLoad.prototype.script = function(a) {
        var b = document.createElement("script");
        this.load(b, a), b.type = "text/javascript", b.src = a, document.head.appendChild(b)
    }, PreLoad.prototype.load = function(a, b) {
        var args = arguments;
        var c = this;
        a.onload = a.onerror = a.onabort = function(a) {
            c.onload && c.onload({
                count: ++c.count,
                total: c.total,
                item: b,
                type: a.type
            })
        }
    };
    //var $progress = document.getElementById('progress')

    function loading(load) {
        var count = load.count
        var total = load.total
        if (count === total) return complete()
    }

    function next(el, fn) {
        el.className += ' scaleOut'
        setTimeout(function() {
            fn && fn()
            el.parentNode.removeChild(el)
        }, 1000)
    }

    function complete() {
        $("img[lazy-img]").each(function() {
            $(this).attr("src", $(this).attr("lazy-img"));
        })
    }

    function lazyImgLodding() {
        var images = []
        $("img[lazy-img]").each(function() {
            images.push($(this).attr("src"));
        })

        var version = '';
        new PreLoad(images, {
            onload: loading,
            version: version
        })
    }

    exports.lazyImgLodding = lazyImgLodding;
})