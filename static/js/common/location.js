/**
 * 网站公用的location处理函数
 * @author flyking
 * @date 2015-09-07
 */

define("mod/common/location", ["./loadjs", "./cookie"], function(loadjs, _cookie) {
    var qq_geolocation = {
        is_support_QQBrowser: function() {
            var userAgent = navigator.userAgent;
            var QQ_BROWSER_FLAG = "MQQBrowser/";
            var index = userAgent.indexOf(QQ_BROWSER_FLAG);
            if (index === -1) {
                return false
            }
            var browserInfo = userAgent.substr(index, 14);
            var browserInfoArr = browserInfo.split("/");
            var browserVersion = parseFloat(browserInfoArr[1]);
            var isAndroid = userAgent.indexOf("Android");
            var isIos = userAgent.indexOf("Mac");
            if (isAndroid !== -1 && browserVersion >= 5.4) {
                return true
            }
            if (isIos !== -1 && browserVersion >= 5) {
                return true
            }
            return false
        },
        getGeoLocation: function(__self) {
            loadjs("http://jsapi.qq.com/get?api=app.getGeoLocation", function() {
                try {
                    browser.app.getGeoLocation(__self.getPosSuccess.bind(__self), __self.getPosError.bind(__self))
                } catch (exc) {
                    console.error("Invoke the browser.app.getGeoLocation throws an exception:" + exc);
                    __self.getPosError(false)
                }
            })
        }
    };
    return {
        show_tips_now_geo_locationing: function() {
            console.log("now geolocation locationing ...")
        },
        after_geo_location: function() {
            console.log("after geolocation location.")
        },
        geo_location_fail: function() {
            console.log("geolocation location fail!")
        },
        get_city_suc_from_coords: function(citydata) {
            console.log("根据经纬度查询城市信息成功！");
            console.log("城市信息是:" + JSON.stringify(citydata))
        },
        get_city_fail_from_coords: function() {
            console.log("根据经纬度查询城市信息失败！")
        },
        err_handle_permission_denied: function(oldcity) {
            console.log("查询地理位置信息失败：您拒绝了共享位置信息")
        },
        err_handle_position_unavailable: function(oldcity) {
            console.log("查询地理位置信息失败：无法获取当前位置")
        },
        err_handle_timeout: function(oldcity) {
            console.log("查询地理位置信息失败：获取位置超时")
        },
        err_handle_unknown_reanson: function(oldcity) {
            console.log("查询地理位置信息失败：未知错误")
        },
        get_city_suc_from_ip: function(citydata) {
            console.log("根据ip查询城市信息成功！");
            console.log("城市信息是:", citydata)
        },
        get_city_fail_from_ip: function() {
            console.log("根据ip查询城市信息失败！")
        },
        getCurrPos: function(conf) {
            console.log("begin getCurrPos");
            var isQQbrowser = qq_geolocation.is_support_QQBrowser();
            if (isQQbrowser) {
                var __self = this;
                qq_geolocation.getGeoLocation(__self)
            } else if (navigator.geolocation) {
                this.show_tips_now_geo_locationing();
                navigator.geolocation.getCurrentPosition(this.getPosSuccess.bind(this), this.getPosError.bind(this), {
                    timeout: 1e4,
                    maximumAge: 6e4,
                    enableHighAccuracy: true
                });
                this.after_geo_location()
            } else {
                this.geo_location_fail()
            }
        },
        getPosSuccess: function(pos) {
            console.log("定位成功");
            var lat = 0,
                lon = 0;
            if (pos.coords) {
                lat = pos.coords.latitude;
                lon = pos.coords.longitude
            } else if (pos.ret) {
                lat = pos.latitude;
                lon = pos.longitude
            } else {
                var qqRetErr = {};
                qqRetErr.code = "";
                this.getPosError(qqRetErr)
            }
            var service_url = "http://" + _rootDomainNoProtocol + "/location/?l=" + lat + "&d=" + lon;
            var self = this;
            $.ajax({
                type: "get",
                url: service_url,
                cache: false,
                dataType: "json",
                success: function(data) {
                    var citydata = data;
                    if (typeof citydata == "object" && citydata.listname.length) {
                        if (window.localStorage) {
                            var saveDate = new Date;
                            try {
                                localStorage.setItem("locationDate", saveDate.getDate());
                                localStorage.setItem("myLat", lat);
                                localStorage.setItem("myLon", lon);
                                $.cookie.set("myLat", lat, null);
                                $.cookie.set("myLon", lon, null);
                                $.cookie.set("ishome", citydata.ishome, null);
                                localStorage.setItem("myCity", citydata.listname);
                                localStorage.setItem("myCityName", citydata.cityname)
                            } catch (err) {}
                        }
                    }
                    self.get_city_suc_from_coords(citydata)
                },
                timeout: 1e4,
                error: function() {
                    self.get_city_fail_from_coords()
                }
            })
        },
        getPosError: function(err) {
            console.log("定位失败");
            var oldcity = ____json4fe.locallist[0].listname;
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    this.err_handle_permission_denied(oldcity);
                    break;
                case err.POSITION_UNAVAILABLE:
                    this.err_handle_position_unavailable(oldcity);
                    break;
                case err.TIMEOUT:
                    this.err_handle_timeout(oldcity);
                    break;
                default:
                    this.err_handle_unknown_reanson(oldcity);
                    break
            }
        },
        getCityIp: function() {
            console.log("根据ip");
            var self = this;
            var ipserverurl = "http://" + _rootDomainNoProtocol + "/ipservice/";
            $.ajax({
                url: ipserverurl,
                dataType: "jsonp",
                cache: false,
                success: function(data) {
                    var ipCityData = data;
                    if (typeof ipCityData == "object" && ipCityData.listname && ipCityData.localname && ipCityData.listname != -1 && ipCityData.localname != -1) {
                        $.cookie.set("ishome", ipCityData.ishome, null);
                        if (window.localStorage) {
                            try {
                                var saveDate = new Date;
                                localStorage.setItem("locationDate", saveDate.getDate());
                                localStorage.setItem("myCity", ipCityData.listname);
                                localStorage.setItem("myCityName", ipCityData.localname)
                            } catch (err) {}
                        }
                        self.get_city_suc_from_ip(ipCityData)
                    } else {
                        self.get_city_fail_from_ip()
                    }
                },
                timeout: 1e4,
                error: function() {
                    self.get_city_fail_from_ip()
                }
            })
        },
        handle_localStorage_hascity: function() {
            console.log("handle_localStorage_hascity")
        },
        posInit: function() {
            if (!localStorage.getItem("locationDate")) {
                this.getCurrPos()
            } else {
                var nowDate = new Date;
                if (nowDate.getDate() == localStorage.getItem("locationDate") && localStorage.getItem("myCity").length) {
                    this.handle_localStorage_hascity()
                } else {
                    this.getCurrPos()
                }
            }
        }
    }
});