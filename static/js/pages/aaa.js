define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var Swiper = require('swiper');

    require("site/template.helper");
    require("pwgmodal");
    //var scroll = require("mod/common/scroll");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    //var layer = require("mod/common/layer");

    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");
    // var scrollTo = require("lib/jquery.scrollTo-min.js")

    var loaddedPage = 1;
    var continueLoad = true;
    var myScroll;

    /*$("input").click(function(){
        var target = this;
        setTimeout(function(){
            target.scrollIntoView(true);
        },100);
    });*/
    window.res = null;
    function fixedWatch(el) {
      if(document.activeElement.nodeName == 'INPUT'){
        el.css('position', 'static');
        window.scrollTo(0, $(window).height());
      } else {
        el.css('position', 'fixed');
        if(window.res ) { clearInterval(window.res ); window.res  = null; }
      }
    }
    $('input').focus(function () {
        if(!window.res) {
            fixedWatch($('#search_btn'));
            window.res = setInterval(function () {
              fixedWatch($('#search_btn'));
            }, 500);
        }
    });
    
})