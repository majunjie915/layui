define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var E = require("mod/common/event");
    var ajax = require("mod/common/ajax");
    var LS = require("mod/common/localStorage");
    var loadding = require("site/loadding.js");
    var layer = require("mod/common/layer");
    var util = require("mod/common/util");

    //var iScroll = require("lib/iscroll");
    /*增加数量、立即购买超限弹出函数*/
    function checknum (buynumber,isJump) {
        var p = LS.get('programLimitP')-LS.get('programLimitC');//可以购买的节目数量
        var s = LS.get('sceneLimitB')-LS.get('sceneLimitC');//可以购买的场次数量
        var pre = LS.get('presaleCoupons');//预售券数量
        var iny = JSON.parse(LS.get('selectedTicket')).inventory;//当前选择票品的库存数量
        var seltcprice = JSON.parse(LS.get('selectedTicket')).selling_price;//当前选择票品的售价
        var ticketLimit = JSON.parse(LS.get('selectedTicket')).buy_limit;
        var presale = LS.get("presale");//是否是预售

        if (buynumber>p && LS.get('programLimitP')!=0) {
            layer.open({
                content: '当前节目限购'+p+'张',
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            return;
        };
        if (buynumber>s && LS.get('sceneLimitB')!=0) {
            layer.open({
                content: '当前场次限购'+s+'张',
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            return;
        };
        if (presale!=0 && pre==0) {
            layer.open({
                content: "仅限有预售资格用户购买",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            return;
        };
        if (presale!=0 && buynumber>pre) {
            layer.open({
                content: '您仅有'+pre+'张预售券',
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            return;
        };
        if (buynumber>iny) {
            layer.open({
                content: "库存不足",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            });
            return;
        };
        if (ticketLimit!=0 && buynumber>ticketLimit) {
            layer.open({
                content: '当前票品限购'+ticketLimit+'张',
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            return;
        };
        // 显示总价
        var buyPrice = Number(buynumber*seltcprice);
        LS.set("buynumber",Number(buynumber));
        if(isJump){
            window.location.href = "./orderConfirm.html?id=" + JSON.parse(LS.get('selectedTicket')).uuid;

        }
    }

    /*接口数据请求函数*/
    function query_detail(data, isInit) {
        var APIData = API.Detail.programNewTickets;

        //判断是否为第一次查询
        isInit = isInit || false;

        var successFn = function(res) { 
            if (!res.sceneTickets || !res.sceneTickets.tickets.length) {
                layer.open({
                    content: "该节目暂无场次,无法查看",
                    //time:2,
                    btn: ['确定'],
                    yes: function() {
                        window.history.go(-1);
                    }

                });
                return;
            }
            var result = {
                data : res.sceneTickets.scene
            }
            var html = template("isBuyNowT",result);
            $("#isBuyNow").append(html);
            var time = result.data.time_remaining;
            if (time != 0) {
                $("#aBtn").attr("data-action","");
            }
            /*节目限制*/
            var program_limit = res.sceneTickets.program_limit;
            var programLimitP = program_limit.program_limit,
                programLimitC = program_limit.customer_used;
            LS.set("programLimitP",programLimitP);
            LS.set("programLimitC",programLimitC);

            var sceneDetail = res.sceneTickets.scene;    
            /*场次限制*/
            var scene_limit = res.sceneTickets.scene_limit;
            var sceneLimitB = scene_limit.buy_limit,
                sceneLimitC = scene_limit.customer_used
            LS.set("sceneLimitB",sceneLimitB);
            LS.set("sceneLimitC",sceneLimitC);

            // 是否可预售
            LS.set("presale",res.sceneTickets.scene.is_presale);

            var program = res.sceneTickets.program;
            sceneDetail.title = program.title;
            //sceneDetail.city.name = sceneDetail.city.name.substring(0,sceneDetail.city.name.indexOf('市'));
            var sdetail = {
                data : sceneDetail
            }
            var tickets = [];
            var selectedPrice = '';
            var selectedArea = '';
            var selectedRow = '';
            var selectedTicket = '';
            var html = template('sceneDetailT', sdetail);
            $("#sceneDetail").append(html);
            var ticketList = res.sceneTickets.tickets;
            for(var i in res.sceneTickets.menu){
                var price = res.sceneTickets.menu[i];
                if(i == 0){
                    price.selected = 1;
                    LS.set('selectedPrice',price.price);
                    selectedPrice = price.price;
                    var area = price.area;
                    for(var j in area){
                        if(j == 0){
                            area[j].selected = 1;
                            LS.set('selectedArea',area[j].name);
                            selectedArea = area[j].name;
                            var row = area[j].rows;
                            for(var k in row){
                                var obj = {};
                                obj.name = row[k];
                                if(k == 0){
                                    obj.selected = 1;
                                    LS.set('selectedRow',row[k]);
                                    selectedRow = row[k];
                                }
                                row[k] = obj;
                            }
                            area[j].rows = row;
                            break;
                        }

                    }
                    price.area = area;
                    res.sceneTickets.menu[i] = price;
                    break;
                }
            }
            var menu = {
                list : res.sceneTickets.menu,
                area : res.sceneTickets.menu[0].area,
                rows : res.sceneTickets.menu[0].area[0].rows,
            }
            LS.set('ticketMenu',JSON.stringify(res.sceneTickets.menu));
            LS.set('ticketsList',JSON.stringify(res.sceneTickets));

            html = template('menuT',menu);
            $("#menu").append(html);

            var ticketList = res.sceneTickets.tickets;
            
            for(var i in ticketList){                
                //console.log(ticketList[i].ticket_price == selectedPrice,ticketList[i].area_name == selectedArea,ticketList[i].arearow == selectedRow);
                if (ticketList[i].inventory==1 && ticketList[i].tag.length==3) {
                    ticketList[i].tag.pop();
                }
                if(ticketList[i].ticket_price == selectedPrice && ticketList[i].vip_buy!=1 && ticketList[i].area_name == selectedArea){
                    tickets.push(ticketList[i]);
                }
            }

            var selectedT = false;
            tickets.sort(function(a,b){
                return a.selling_price-b.selling_price;
            });
            // tickets = filterTickets(tickets);
            for(var i in tickets){
                var className_i = '';
                var className_a = 'p_link';
                if(tickets[i].inventory > 0){
                    if(!selectedT){
                        selectedT = true;
                        selectedTicket = tickets[i];
                        LS.set('selectedTicket',JSON.stringify(tickets[i]));
                        LS.set('selectedAreaId',tickets[i].area_id);
                        tickets[i].selected = 1;
                    }
                }

        
            }
            data = {list : tickets};
            html = template('ticketListT',data);
            $("#itemInfo").append(html);
            
            soldOutStyle()

            /*判断是否有票，决定能否购买*/
            if(tickets.length == 0){
                $("#aBtn").attr('class','aBtn disableBtn');
                $("#aBtn").attr('data-disabled','1');
            }else{
                /*有票时判断库存，决定能否购买*/
                var allOver = true;
                for(var i in tickets){
                    if(tickets[i].inventory > 0){
                        allOver = false;
                        break;
                    }
                }
                if(allOver){
                    $("#aBtn").attr('class','aBtn disableBtn');
                    $("#aBtn").attr('data-disabled','1');
                }else{
                    $("#aBtn").attr('class','aBtn');
                    $("#aBtn").attr('data-disabled','');
                }
            }
            /*选中票预售券数量*/
            var presaleCoupons = res.sceneTickets.presale_coupons.length;
            LS.set("presaleCoupons",presaleCoupons);

            bindChooseEvent();
            initNums();
            
            timeStamp(time);
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

    // 售罄的样式
    function soldOutStyle(){
        $(".over .price").removeClass("price");
        $(".over .seatDesc").addClass("newSeatDesc");
        $(".over .seatDesc").removeClass("seatDesc");
        $(".over .typeOperation2").addClass("gray");
        $(".over .typeOperation2").removeClass("typeOperation2");
        $(".over .tc_set_title").attr("style","color:#b1b1b1");
    }
    
    /*初始化数量、总价*/
    function initNums(){
        
        var buynumber = 1;
        $("#buynumber").text(buynumber);
        var nums = parseInt(buynumber);
        var price = Number($("i.p_sel").parent().find("span.price").text().slice(1));
        
        $("#countPrice").text("￥"+(nums*price).toFixed(2));
        LS.set("buynumber",$("#buynumber").text());
        
    }

    //倒计时
    function timeStamp(second_time){
        var sel = setInterval(function() {  
            var time = parseInt(second_time) + "秒";
            var min = 0;
            var hour = 0;
            var day = 0;                        
            if( parseInt(second_time )> 60){
                var second = parseInt(second_time) % 60;  
                var min = parseInt(second_time / 60); 
                min = min < 10 ? '0' + min : '' + min;
                second = second < 10 ? '0' + second : '' + second; 
                time = min + "分" + second + "秒";              
                if( min > 60 ){
                    min = parseInt(second_time / 60) % 60;
                    min = min < 10 ? '0' + min : '' + min;  
                    var hour = parseInt( parseInt(second_time / 60) /60 ); 
                    hour = hour < 10 ? '0' + hour : '' + hour; 
                    time = hour + "小时" + min + "分" + second + "秒";        
                    if( hour > 24 ){  
                        hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                        hour = hour < 10 ? '0' + hour : '' + hour;  
                        var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                        day = day < 10 ? '0' + day : '' + day;   
                        time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
                    }  
                }     
            }
            if (parseInt(second_time ) <= 0) {
                $("#aBtn").attr("data-action","addOrder");
                $("#aBtn").css({
                    "color":"#202020",
                    "font-size":"18px"
                });
                $("#aBtn").html("立即购买");
                clearInterval(sel);
                return;
            }           
            second_time--;
        }, 1000);
    }

    function bindEvents() {
        var eventsObj = {
            "addOrder": function() {
                if($(this).attr('data-disabled') == 1){
                    return;
                }
                checknum(parseInt($("#buynumber").text()),true);
                return;
                var selectedTicket = JSON.parse(LS.get('selectedTicket'));
            
                if(selectedTicket.is_presale > 0){
                    query_ticket_presale_coupons({_vt:LS.get('_vt'),commodity_codes:selectedTicket.presale_coupon_codes},LS.get('selectedScene'),selectedTicket.uuid);
                }else{
                    window.location.href = "./orderConfirm.html?id=" + selectedTicket.uuid;
                }

            },
            
            'minusNum' : function(){
                var buynumber = parseInt($("#buynumber").text()) - 1 >= 1 ? parseInt($("#buynumber").text()) - 1 : 1;
                $("#buynumber").text(buynumber);
                var nums = parseInt(buynumber);
                var price = Number($("i.p_sel").parent().find("span.price").text().slice(1));
                $("#countPrice").text("￥"+(nums*price).toFixed(2));
                LS.set("buynumber",$("#buynumber").text());
            },
            
            'addNum' : function(){
                var buynumber = Number(LS.get("buynumber"))+1;
                checknum (buynumber,false);
                if ($("#buynumber").text()>=buynumber) {
                    $("#buynumber").text(buynumber-1);
                }               
                buynumber = parseInt($("#buynumber").text()) + 1 <= 500 ? parseInt($("#buynumber").text()) + 1 : 500;
                               
                $("#buynumber").text(LS.get("buynumber"));
                var nums = parseInt(LS.get("buynumber"));
                var price = Number($("i.p_sel").parent().find("span.price").text().slice(1));
                $("#countPrice").text("￥"+(nums*price).toFixed(2));

            },
            'packageList' : function(){
                var inventory = $(".p_nr").data("inventory");
                if (inventory!=0) {
                    window.location.href="./packageList.html?scene_id="+program_id;
                }
            },
            'showSite' : function(){
                var imgsrc = $(this).attr('data-src');
                if(imgsrc){
                    layer.open({
                        type : 1,
                        btn: [''],
                        content : '<div class="pop_img"><a href="javascript:;" class="layermbtn"><img src="'+imgsrc+'" width="100%"/></a></div>',
                    });
                }
                else{
                    layer.open({
                        time: 2,
                        style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                        content: '暂无座位图'
                    });
                }
            }
        }
        E.actionMap("body", eventsObj);
    }
    /*排序函数*/
    function orderTickets(isAscending){
        //var price = $("#itemInfo li").attr('data-price');
        var selectedPrice = LS.get('selectedPrice');
        var selectedArea = LS.get('selectedArea');
        var selectedTicket = '';

        var tmenu = JSON.parse(LS.get('ticketMenu'));
        var tickets = [];
        var ticketList = JSON.parse(LS.get('ticketsList')).tickets;
        
        for(var i in ticketList){
            if(ticketList[i].ticket_price == selectedPrice && ticketList[i].vip_buy!=1 && ticketList[i].area_name == selectedArea){
                tickets.push(ticketList[i]);
            }
        }
        $("#itemInfo").html('');
        if(tickets.length == 0){
            $("#aBtn").attr('class','aBtn disableBtn');
            $("#aBtn").attr('data-disabled','1');
        }else{
            var allOver = true;
            for(var i in tickets){
                if(tickets[i].inventory > 0){
                    allOver = false;
                    break;
                }
            }
            if(allOver){
                $("#aBtn").attr('class','aBtn disableBtn');
                $("#aBtn").attr('data-disabled','1');
            }else{
                $("#aBtn").attr('class','aBtn');
                $("#aBtn").attr('data-disabled','');
            }
        }
        var selectedT = false;
        /*对票排序*/
        tickets.sort(function(a,b){
            var result = a.selling_price-b.selling_price;
            if(isAscending){
                result = -result;
            }
            return result;
        });
        // tickets = filterTickets(tickets);
        for(var i in tickets){
            var className_i = '';
            var className_a = 'p_link';
            var click = '';
            var objArr = [];
            if(tickets[i].inventory > 0){
                click = ' onclick="chooseTicket(this);return false"';
                showImage = 'image';
                if(!selectedT){
                    className_i = 'p_sel';
                    selectedT = true;
                    selectedTicket = tickets[i];
                    LS.set('selectedTicket',JSON.stringify(tickets[i]));
                    LS.set('selectedAreaId',tickets[i].area_id);
                }
            }else{
                className_a = 'p_link over';
                className_i = 'p_over';
                showImage = ' ';
            }
            if (tickets[i].has_gift==1) {
                showPackage = '<img src="../static/images/package.png"  class="package"/>';

            }else{
                showPackage = "";
            }

            if (tickets[i].owner.is_offical=="1") {
                typeOperation = '<span class="typeOperation2">自营</span>&nbsp;&nbsp;<span>'+tickets[i].owner.company_ab+'</span>';
            }else{
                typeOperation = '<span class="typeOperation1">认证</span>&nbsp;&nbsp;<span>'+
                                tickets[i].owner.company_ab+'</span>';
            }

            if (tickets[i].full_prepay==1) {
                showFullOrder = '<img src="../static/images/fullOrder.png" class="fullPreOrder" style="width:50px;height:18px;margin:0 0 5px 8px;">';
            }else{
                showFullOrder = "";
            }
            if (tickets[i].inventory==1) {
                showRemainderCount = '<span class="remainderCount">仅剩<span>1</span>张</span>';
            }else{
                showRemainderCount = "";
            }
            if (tickets[i].tag[0]!=undefined) {
                tag1 = '<span class="seatDesc">'+tickets[i].tag[0]+'</span>';
            }else{
                tag1 = "";
            }
            if (tickets[i].tag[1]!=undefined) {
                tag2 = '<span class="seatDesc">'+tickets[i].tag[1]+'</span>';
            }else{
                tag2 = "";
            }
            if (tickets[i].tag[2]!=undefined && tickets[i].inventory!=1) {
                tag3 = '<span class="seatDesc">'+tickets[i].tag[2]+'</span>'
            }else{
                tag3 = "";
            }
            var html = '<li>'+
                    '<div class="p_nr" data-inventory ='+ tickets[i].inventory+'>'+
                        '<a'+click+' data-action="chooseTicket" data-value="'+tickets[i].uuid+'" class="'+className_a+'">' +
                            '<table class="tc_set_title">'+
                               '<tr>'+
                                    '<td>'+typeOperation+'</td>'+
                               '</tr>'+
                               '<tr class="tc_set_title">'+
                                   '<td>'+
                                        '<span class="rowNum">'+tickets[i].arearow+'</span>'+
                                        '<span>'+tickets[i].description+
                                        '</span>'+
                                    '</td>'+
                                   '<td><span class="price">￥'+tickets[i].selling_price+'</span></td>'+
                                    '<td><div class="'+showImage+'"></div></td>'+
                               '</tr>'+
                               '<tr>'+
                                   '<td>'+
                                        showRemainderCount+
                                        tag1+
                                        tag2+
                                        tag3+
                                    '</td>'+
                                    '<td>'+
                                        '<a href="javascript:;" data-action="packageList">'+showPackage+'</a>'+                                       
                                    '</td>'+
                               '</tr>'+
                            '</table>'+ 
                            '<i class="'+className_i+'"></i>' +
                        '</a>'+
                    '</div>'+
                '</li>'
            $("#itemInfo").append(html);
        }
        initNums();
        soldOutStyle();
    };
    // 删除非官网已售罄的票
    function filterTickets(objArr){
        var TicketsSaling = [];
        var TicketsOfficialSoldOut = [];
        for(var i=0; i<objArr.length; i++){
            if(objArr[i].inventory != "0"){
                TicketsSaling.push(objArr[i]);
            }else if(objArr[i].owner.is_offical=="1"){
                TicketsOfficialSoldOut.push(objArr[i]);
            }
        }
        return TicketsSaling.concat(TicketsOfficialSoldOut);
    }
    /*选择某一票品。分四步选择：选择票档、区域、排号、票*/
    function bindChooseEvent(){
        /*选择票档*/
        $(".priceList").delegate('a','click',function(){
            $(".orderLine").find("span:eq(1)").addClass("priceOrder").removeClass("changeOrder");
            LS.set("buynumber",$("#buynumber").text());
            var price = $(this).attr('data-value');
            var selectedPrice = price;
            var selectedArea = '';
            var selectedRow = '';
            var selectedTicket = '';
            $(".priceList").find('a').each(function(index,obj){
                if($(obj).attr('data-value') == price){
                    $(obj).attr('class','sel');
                }else{
                    $(obj).attr('class','');
                }
            });
            LS.set('selectedPrice',price);
            var tmenu = JSON.parse(LS.get('ticketMenu'));
            var arealist = [];
            var rowlist = [];
            var tickets = [];
            var ticketList = JSON.parse(LS.get('ticketsList')).tickets;

            for(var i in tmenu){
                if(tmenu[i].price == price){
                    area = tmenu[i].area;
                    for(var j in area){
                        var a = {};
                        a.name = area[j].name;
                        if(j == 0){
                            selectedArea = area[j].name;
                            a.selected = 1;
                        }
                        arealist.push(a);
                    }
                    break;
                }
            }

            $(".areaList").html('');
            for(var i in arealist){
                var selected = '';
                if(i == 0){
                    selected = 'class="sel"';
                    selectedArea = arealist[i].name;
                    LS.set('selectedArea',arealist[i].name);
                }
                var html = '<a href="javascript:void(0);" data-action="chooseArea" data-value="'+arealist[i].name+'" '+selected+'>'+arealist[i].name+'</a>';
                $(".areaList").append(html);
            }
            for(var i in ticketList){
                //console.log(selectedPrice,selectedArea,selectedRow);
                if(ticketList[i].ticket_price == selectedPrice && ticketList[i].vip_buy!=1 && ticketList[i].area_name == selectedArea){
                    tickets.push(ticketList[i]);
                }
            }
            $("#itemInfo").html('');
            var selectedT = false;
            if(tickets.length == 0){
                $("#aBtn").attr('class','aBtn disableBtn');
                $("#aBtn").attr('data-disabled','1');
            }else{
                var allOver = true;
                for(var i in tickets){
                    if(tickets[i].inventory > 0){
                        allOver = false;
                        break;
                    }
                }
                if(allOver){
                    $("#aBtn").attr('class','aBtn disableBtn');
                    $("#aBtn").attr('data-disabled','1');
                }else{
                    $("#aBtn").attr('class','aBtn');
                    $("#aBtn").attr('data-disabled','');
                }
            }
            orderTickets(false);
        });
        /*选择区域*/
        $(".areaList").delegate('a','click',function(){
            $(".orderLine").find("span:eq(1)").addClass("priceOrder").removeClass("changeOrder");
            LS.set("buynumber",$("#buynumber").text());
            var area = $(this).attr('data-value');
            var selectedPrice = LS.get('selectedPrice');
            var selectedArea = area;
            var selectedRow = '';
            var selectedTicket = '';
            LS.set('selectedArea',area);
            $(".areaList").find('a').each(function(index,obj){
                if($(obj).attr('data-value') == area){
                    $(obj).attr('class','sel');
                }else{
                    $(obj).attr('class','');
                }
            });
            var tmenu = JSON.parse(LS.get('ticketMenu'));
            var tickets = [];
            var ticketList = JSON.parse(LS.get('ticketsList')).tickets;
            var rowlist = [];
            for(var i in tmenu){
                if(tmenu[i].price == selectedPrice){
                    a = tmenu[i].area;
                    for(var j in a){
                        if(a[j].name == area){
                            rows = a[j].rows;
                        }
                    }
                }

            }

            $(".rowList").html('');
            for(var i in rowlist){
                var selected = '';
                if(i == 0){
                    selected = 'class="sel"';
                    selectedRow = rowlist[i].name;
                    LS.set('selectedRow',rowlist[i].name);
                }
                var html = '<a onclick="chooseTicket(this);return false;" data-action="chooseArea" data-value="'+rowlist[i].name+'" '+selected+'>'+rowlist[i].name+'</a>';
                $(".rowList").append(html);
            }
            for(var i in ticketList){
                if(ticketList[i].ticket_price == selectedPrice && ticketList[i].vip_buy!=1 && ticketList[i].area_name == selectedArea){
                    tickets.push(ticketList[i]);
                }
            }

            $("#itemInfo").html('');
            var selectedT = false;
            if(tickets.length == 0){
                $("#aBtn").attr('class','aBtn disableBtn');
                $("#aBtn").attr('data-disabled','1');
            }else{
                var allOver = true;
                for(var i in tickets){
                    if(tickets[i].inventory > 0){
                        allOver = false;
                        break;
                    }
                }
                if(allOver){
                    $("#aBtn").attr('class','aBtn disableBtn');
                    $("#aBtn").attr('data-disabled','1');
                }else{
                    $("#aBtn").attr('class','aBtn');
                    $("#aBtn").attr('data-disabled','');
                }
            }
            orderTickets(false);
        });
        /*按照价格排序*/
        $(".orderLine").click(function(){
            var elementSpan = $(this).find("span:eq(1)");
            if (elementSpan.attr("class")=="priceOrder") {
                elementSpan.attr("class","changeOrder");
                orderTickets(true);
            }else if (elementSpan.attr("class")=="changeOrder") {
                elementSpan.attr("class","priceOrder");
                orderTickets(false);
            }
        });

        /*选择票*/
        $("#itemInfo").delegate('a','click',function(){
            var nums = parseInt($("#buynumber").text());
            var price = Number($("i.p_sel").parent().find("span.price").text().slice(1));
            $("#countPrice").text("￥"+(nums*price).toFixed(2));
            //$("i.p_sel").parent().find("span#img").addClass("isChecked").removeClass("image");
            LS.set("buynumber",$("#buynumber").text());
            if($(this).attr('class') == 'p_link over'){
                return;
            }
            selectedTicket = JSON.parse(LS.get('selectedTicket'));
            if($(this).attr('data-value') == selectedTicket.uuid){
                return;
            }
            $(this).find('i').attr('class','p_sel');
            //$(this).siblings().find("i").removelass("p_sel");
            uuid = $(this).attr('data-value');

            var ticketList = JSON.parse(LS.get('ticketsList')).tickets;
            
            for(var i in ticketList){
                if(ticketList[i].uuid == uuid){
                    LS.set('selectedTicket',JSON.stringify(ticketList[i]));
                    LS.set('selectedAreaId',tickets[i].area_id);

                }
            }
        });
        var nums = parseInt($("#buynumber").text());
        var price = Number($("i.p_sel").parent().find("span.price").text().slice(1));
        $("#countPrice").text("￥"+(nums*price).toFixed(2));

    }

    function init() {
        var params = util.toQueryParams();
        program_id = params.scencid;        
        if (LS.get("_vt")) {
            var data = {
                _vt:LS.get("_vt"),
                scene_id: params.scencid || ""
            }
        }else{
            window.location.href = "./logon.html";
        }
        query_detail(data, true);
        // query_package(packageData);
        bindEvents();

    }
    var collectionList = [];
    var program_id = '';
    var sceneDetail = null;

    init();

});
function chooseTicket(obj){
    document.getElementById("buynumber").innerHTML = "1";

    var uuid = obj.getAttribute('data-value');
    selectedTicket = JSON.parse(localStorage.getItem('selectedTicket'));
    if(uuid == selectedTicket.uuid){
        return;
    }
    var child = document.getElementById('itemInfo').childNodes;
    
    var childList = [];
    for(var i in child){
        if(child[i].nodeName == 'LI'){
            if(child[i].getAttribute('data-value') != uuid){
                var tag_i = child[i].getElementsByTagName('i')[0];
                if(tag_i.getAttribute('class') == 'p_over'){
                    continue;
                }
                tag_i.setAttribute('class','');

            }
        }
    }
    if(obj.getAttribute('class') == 'p_link over'){
        return;
    }
    if(obj.getAttribute('data-value') == selectedTicket.uuid){
        return;
    }

    for(var i in obj.childNodes){
        if(obj.childNodes[i].nodeName == 'I'){
            obj.childNodes[i].setAttribute('class','p_sel');
        }
    }
    //$(obj).find('i').setAttribute('class','p_sel');

    var ticketList = JSON.parse(localStorage.getItem('ticketsList')).tickets;
    for(var i in ticketList){
        if(ticketList[i].uuid == uuid){
            localStorage.setItem('selectedTicket',JSON.stringify(ticketList[i]));
        }
    }
}