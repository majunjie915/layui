define(function(require, exports) {
	var iScroll = require("lib/iscroll");
    var $ = require("jquery");

    var myScroll,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0;

    var iScollObj = {} 

    /**
     * 下拉刷新 （自定义实现此方法）
     * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
     */
    function pullDownAction() {
        setTimeout(function() { 
        	if(typeof iScollObj.pullDownFn=="function"){
        		iScollObj.pullDownFn();
        	}
        	
            setTimeout(function(){myScroll.refresh()},1000); 
        }, 1000); 
    }

    /**
     * 滚动翻页 （自定义实现此方法）
     * myScroll.refresh();	
     */
    function pullUpAction() {
        setTimeout(function() { 

        	if(typeof iScollObj.pullUpFn=="function"){
        		iScollObj.pullUpFn();
        	}
            setTimeout(function(){myScroll.refresh();},1000);
            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉加载';
        }, 1000); 
    }

    function creatScroll(obj){

    	iScollObj = obj;
    	return loaded();
    }
    /**
     * 初始化iScroll控件
     */
    function loaded() {
        pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight  ;
        pullUpEl = document.getElementById('pullUp');
        pullUpOffset = pullUpEl.offsetHeight;

        myScroll = new iScroll.iScroll('scrollWrapper', {
            scrollbarClass: 'myScrollbar',
            /* 重要样式 */
            useTransition: false,
            /* 此属性不知用意，本人从true改为false */
            topOffset: pullDownOffset,

            onRefresh: function() {
                if (pullDownEl.className.match('loading')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                } else if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多';
                }
            },
            onScrollMove: function() {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    
                    if($("#pullUp").data("complete")) return;


                    pullDownEl.className = 'flip';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '开始更新';
                    this.minScrollY = 0;
                } else if (this.y < 50 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                    this.minScrollY = -pullDownOffset;
                } else if (this.y < (this.maxScrollY - 50) && !pullUpEl.className.match('flip')) {
                    
                    if($("#pullUp").data("complete")) return;

                    pullUpEl.className = 'flip';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '开始更新...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 50) && pullUpEl.className.match('flip')) {

                    if($("#pullUp").data("complete")) return;

                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多';
                    this.maxScrollY = pullUpOffset;
                }
            },
            onScrollEnd: function() {
                if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';
                    if($("#pullUp").data("complete")) return;
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载更多';
                    //pullDownAction(); 
                } else if (pullUpEl.className.match('flip')) {
                    
                    if($("#pullUp").data("complete")) return;

                    pullUpEl.className = 'loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多';
                    pullUpAction(); 
                }
            }
        });
        setTimeout(function(){myScroll.refresh()},10000); 
        setTimeout(function() {
            document.getElementById('scrollWrapper').style.left = '0';
        }, 800);
        return myScroll;
    }

    //初始化绑定iScroll控件 
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);
    //document.addEventListener('DOMContentLoaded', loaded, false);
    return creatScroll;
})