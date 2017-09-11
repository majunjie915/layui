layui.define(function(exports) {
    var interFace = {
        'adomain':'http://test-a.vipiao.com',
        'mdomain':'http://test-m.vipiao.com',
        /*公共接口*/
        'Common': {
            getProvice: {
                url: '/v3/pca/provinces',
                type: 'get'
            }, //获取省
            getCity: {
                url: '/v3/pca/cities',
                type: 'get'
            }, //获取市
            getArea: {
                url: '/v3/pca/areas',
                type: 'get'
            }, //获取区
        },
        /*用户数据接口 - */
        'User': {
            'upload_header': {
                url: '/v3/api/app/user/upload_header',
                type: 'post',
                data: {
                    user_id: 1, //string 否 用户id
                    upfile: '/uploads/header/2015_09_06_15_48_32.png' //用户的上传图片地址
                },
            }, //上传用户头像
            'login': {
                url: '/v3/user/login',
                type: 'post',                
                data: {
                },
            }, //用于用户登录
            'register': {
                url: '/v3/user/register',
                type: 'post',
                data: {
                },
            }, //用户注册
            'kejianglogin': {
                url: '/v5/kejiang/kejiang-login',
                type: 'get',                
                data: {
                },
            }, //用于用户登录
            'change_pass_word': {
                url: '/v3/user/change-password',
                type: 'post',
                data: {
                },
            }, //用于用户修改密码
            'sms_captcha': {
                url: '/v3/user/sms-captcha',
                type: 'post',
                data: {
                    phone: '13718394610', //   string  是   手机号
                    mode: 0 //string "0"为注册，“1”为修改密码
                },
            }, //用于注册，忘记密码时候获取验证码
            'third_login': {
                url: '/v3/user/third-login',
                type: 'post',
                data: {
                    rsa_str: '' //string 是  传一个加密的字符串，加密内容为register_source,openid，header,nicheng的json字符串
                },
            }, //用于第三方登录
            'get_user_data': {
                url: '/v3/user/user-data',
                type: 'post',
                data: {
                    rsa_str: '' //string    是   传一个加密的字符串，加密内容为user_name的json字符串
                },
            }, //用于获取个人信息
            'update_person_information': {
                url: '/v3/user/update-user-data',
                type: 'post',
                data: {
                    rsa_str: '' //string 是  传一个加密的字符串，加密内容为user_id，sex，email，mobile，birthday，header，name，address，nick_name的json字符串，其中除了user_id其他都不是必须填的，填哪个更新哪个
                },
            }, //更新用户信息
        },
        /*我的地址 - */
        'Address': {
            'get_my_address': {
                url: '/v3/address/address',
                type: 'post',
                data: {
                    user_id: '1', //string 否 用户id， 穿它为获取个人的地址列表
                    is_default: '', //string 否 是否默认地址， 为获取默认地址
                    address_id: '', //string 否 传他， 为获取单一的对应地址
                },
            }, //获取我的地址
            'add_my_address': {
                url: '/v3/address/add-address',
                type: 'post',
                data: {
                    user_id: '1', //string 是 用户id
                    address: '', //string 是 具体地址
                    province: '', //string 是 省
                    city: '', //string 是 市
                    area: '', //string 是 区
                    name: '', //string 是 姓名
                    mobile: '', //0 是 手机号
                },
            }, //添加地址
            'update_my_address': {
                url: '/v3/address/update-address',
                type: 'post',
                data: {
                    address_id: '', //string 是 地址id
                    address: '', //string 是 具体地址
                    province: '', //string 是 省
                    city: '', //string 是 市
                    area: '', //string 是 区
                    name: '', //string 是 姓名
                    mobile: '', //string 是 电话
                },
            }, //更新地址
            'change_default_address': {
                url: '/v3/address/change-default-address',
                type: 'post',
                data: {
                    user_id: '1', //string 是 用户id
                    address_id: '', //string 是 地址的id
                },
            }, //改为默认地址
            'delete_my_address': {
                url: '/v3/address/delete-address',
                type: 'post',
                data: {
                    user_id: '1', //string 是 用户id
                    address_id: '', //string 是 地址id
                },
            }, //删除地址
        },
        /*订单管理 - */
        'Order': {
            'order_list': {
                url: '/v3/order/customer-orders',
                type: 'post',
                data: {
                    id: '', //string 是 用户id
                },
            }, //获取订单列表
            'create_order': {
                url: '/v3/order/create',
                type: 'post',
                data: {
                    customer_id: '', //string 是 用户ID
                    address_id: '', //string 是 地址ID
                    source: '', //string 是 订单来源（ iOS、 android、 h5）
                    pay_type: '', // int 是 支付类型(0-- -- - 微信支付， 1-- -- --支付宝支付)
                    number: '', // int 是 购买数量
                    ticket_id: '', //string 是 票品ID
                    coupon_id: '', //string 否 代金券ID
                },
            }, //下单
            'get_order': {
                url: '/v3/order/order',
                type: 'post',
                data: {
                    code: '', //string 是 订单ID
                },
            }, //根据订单ID查找单个订单
            'checkout': {
                url: '/v4/order/checkout',
                type: 'post',
                data: {
                    ticket_id: '', //string 票品code
                },
            }, //确认订单
            'pufaPay': {
                url: '/v3/webpay/kejiang-pay',
                type: 'post',
                data: {                    
                },
            }, //浦发支付
            'create_presale_order': {
                url: '/v3/order/presale-create',
                type: 'post',
                data: {
                    customer_id: '',     //string 是 用户id
                    source: '',          //string 是 来源
                    number: '',          //int    是 张数
                    commodity_code: '',  //string 是 预售券商品编号
                    customer_name: '',   //string 是 用户名
                    customer_mobile: '', //string 是 用户手机号
                    remarks: '',         //string 是 备注
                },
            }, //根据订单ID查找单个订单
            'get_refunds': {
                url: '/v4/order/order-refunds',
                type: 'get',
                data: {
                    order_code: '',     //订单号                    
                },
            }, //订单退款记录
        },
        /*优惠券 - */
        'Coupons': {
            'get_coupons': {
                url: '/v3/coupon/coupons',
                type: 'get',
                data: {
                    user_id: '1', //string 是 用户id
                },
            }, //获取优惠券列表
            'get_single_coupon': {
                url: '/v3/coupon/single-coupon',
                type: 'get',
                data: {
                    id: '', //string 是 优惠券id
                },
            }, //获取单一优惠券
            'update_coupon_status': {
                url: '/v3/coupon/coupon-status',
                type: 'post',
                data: {
                    id: '', //string 是 优惠券id
                    status: '', //string 是 使用状态
                },
            }, //更新优惠券使用状态
            'delete_coupon': {
                url: '/v3/coupon/delete-coupon',
                type: 'post',
                data: {
                    id: '', //string 是 优惠券id
                },
            }, //删除优惠券
            'bind_coupon': {
                url: '/v3/coupon/bind-coupon',
                type: 'post',
                data: {
                    user_id: '1', //string 是 用户id
                    account_number: '', //string 是 优惠券账号
                    pass_word: '', //string 是 优惠券密码
                },
            }, //绑定优惠券
            'get_presale_coupons':{
                url : '/v3/coupon/presale-coupons',
                type : 'get',
                data: {
                    user_id : '1',//用户id
                    page : '1',//页数
                    page_size : '1',//页面条数
                    codes : [],//商品编号
                }
            },//获取我的预售券列表
            'get_ticket_presale_coupons':{
                url : '/v3/coupon/ticket-presale-coupons',
                type : 'get',
                data: {
                    user_id : '1',//用户id
                    commodity_codes : [],//页数
                }
            },//获取用户买票时可用预售券列表
            'bind_coupon_password':{
                url : '/v3/coupon/password',
                type : 'post',
                data: {
                    user_id : '1',//用户id
                    password : '',//口令
                }
            },//获口令活动
        },
        /*用户反馈 - */
        'Feedback': {
            'add': {
                url: '/v3/feedback/feedback',
                type: 'post',
                data: {
                    user_id: '1', //string 否 用户id
                    user_name: '', //string 否 用户名
                    contents: '', //string 是 反馈内容
                    source: '', //string 否 来源
                    pic_url: '', //string 否 反馈图片地址
                },
            }, //添加用户反馈
            'upload_pic': {
                url: '/v3/app/feedback/upload_pic',
                type: 'post',
                data: {
                    upfile: '', // file 是 反馈图片
                },
            }, //上传反馈图片
        },
        /*我的收藏 - */
        'Collection': {
            'add': {
                url: '/v3/collection/add-collection',
                type: 'post',
                data: {
                    user_id: '1', //string 是 用户id
                    program_id: '', //string 是 节目id
                    scene_id: '', //string 是 场次id
                },
            }, //添加收藏
            'delete': {
                url: '/v3/collection/delete-collection',
                type: 'post',
                data: {
                    user_id: '1', //string 是 用户id
                    program_id: '', //string 是 节目id
                },
            }, //取消收藏
            'fetch': {
                url: '/v3/collection/collections',
                type: 'get',
                data: {
                    user_id: '1', //string 是 用户id
                },
            }, //3 获取我的收藏列表
        },
        /*节目详情 - */
        'Detail': {
            'query_program': {
                url: '/v5/program/info',
                type: 'get',
                data: {
                    program_id: '',
                    city_code:'',
                },
            }, //获取节目详情
            'query_programs': {
                url: '/v5/program/info',
                type: 'get',
                data: {
                    program_id: '',
                    city_code:'',
                },
            }, //4.3的获取节目详情
            'query_program_desc': {
                url: '/v4/program/program-desc',
                type: 'get',
                data: {
                    program_id: '',
                },
            }, //获取节目介绍
            'appointment': {
                url: '/v4/program/appointment',
                type: 'post',
                data: {
                    program_id: '',
                    scene_id:'',
                    name:'',
                    moblie:'',
                },
            }, //预约场次
            'query_detail': {
                url: '/v3/detail/details',
                type: 'get',
                data: {
                    program_id: '', //string 是 节目id
                },
            }, //获取节目的场次详情
            'query_ticket': {
                url: '/v3/detail/tickets',
                type: 'get',
                data: {
                    scene_id: '', //string 是 场次id
                },
            }, //获取场次的票品详情
            'query_content': {
                url: 'http:',
                type: 'get',
                data: {
                    scene_id:""
                },
            }, //获取场次的详细介绍
            'query_coupon': {
                url: '/v3/detail/presale-coupon',
                type: 'get',
                data: {
                    code:""
                },
            }, //获取预售券详情
            'new_tickets' : {
                url : '/v3/detail/new-tickets',
                type : 'get',
                data : {
                    scene_id : 1
                }
            },
            'programNewTickets':{
                url : '/v5/program/new-tickets',
                type : 'get',
                data : {
                    scene_id : 1
                }
            }//票品选择页
        },
        /*首页 - */
        'Home': {
            'get_home_data' : {
                url : '/v4/home/data',
                type : 'get',
                data :{}
            },            
        },

        /*4.2首页*/
        'homeData': {
            'getHomeData': {
                url: '/v5/home/data',
                type: 'get',
                data: {
                    page: '', // int 否 页数
                    page_size: '', // int 否 页容量
                },
            }
        },
        /*套餐 - */
        'Package': {
            'getPackage' : {
                url : '/v3/detail/tickets-with-gift',
                type : 'get',
                data :{}
            }
            
        },
        
        /*首页演出列表*/
        'Program': {
            'programList': {
                url: '/v4/home/list',
                type: 'get',
                data: {
                    city_code: '', //string 否 城市
                    category_id:'',//节目类型id
                    page: '', // int 否 页数
                    page_size: '', // int 否 页容量
                },
            }, 
        }, 


		 /*发现*/
		 'faxian': {
            'get_activities_list' : {
                url : '/v3/find/recommended-items',
                type : 'get',
                data: {
                    page: '', // int 否 页数
                    page_size: '', // int 否 页容量
                },
            },//获取预售券数据
        },

        /*选择城市*/
        'group_cities': {
            url: '/v3/home/cities',
            type: 'get'
        },
        /*搜索页面*/
        'Search': {
            'hints': {
                url: '/v3/search/hot-words',
                type: 'get'
            }, //获取搜索热词和关键字
            'programs': {
                url: '/v3/search/programs',
                type: 'get'
            } //搜索节目列表
        },
        /*抽奖接口*/
        'active' : {
            'get_list' : {
                url : '/v3/lottery/hits',
                type : 'get',
                data : {
                    page : 1,
                    page_size : 5
                }
            },//参与列表
            'get_history' : {
                url : '',
                type : 'get',
                data : {
                    userid : 1,     //用户id
                    page : 1,
                    page_size : 5,
                }
            },//获取个人中奖历史
            'join_draws' : {
                url : '/v3/lottery/draws',
                type : 'post',
                data : {userid : 1}
            },//抽奖
            'get_address' : {
                url : '/v3/lottery/hits',
                type : 'put',
                data : {
                    id : 1,//抽奖id
                    address_id : 1 //地址id
                }
            },//中奖人联系方式接口
        },
        /* IM接口 */
        'im' : {
            'get_tribes':{
                url : '/v3/im/tribe/tribes',
                type : 'get',
                data : {}
            },//获取群组列表
            'join_tribe_users':{
                url : '/v3/im/tribe/tribe-users',
                type : 'post',
                data :{
                    uid: '1',
                    taobao_account: 'false',
                    tribe_id: '1'
                }
            },//加入群组
            'tribe_blacklist':{
                url : '/v3/im/tribe/blacklist-users',
                type : 'post',
                data :{
                    'uid' : 1,
                }
            },//将用户加入黑名单
            'out_tribe_users':{
                url : '/v3/im/tribe/tribe-users',
                type : 'delete',
                data :{
                    'uid' : 1,
                    'taobao_account' : 'false',
                    'tribe_id' : 1
                }
            },//退出群组
        },
        /* 分享详情 */
        'fandom' : {
            'get_tribes': {
                url: '/v3/fandom/posts',
                type: 'get',
                data: {user_id:1,bar_id:1,id:1}
            },//获取帖子详情
            'get_bar': {
                url: '/v3/share/bar',
                type: 'get',
                data: {bar_id:1}
            },//获取圈子详情
            'get_hotPost': {
                url: '/v3/share/bar-hotpost',
                type: 'get',
                data: {bar_id:1}
            },//获取热门帖子
            'get_wechat': {
                url: '/common/wechat/sign',
                type: 'get',
                data: {url:''}
            },//微信分享
            'invitation': {
                url: '/v3/invitation/invitation-rule',
                type: 'get',
                data: {}
            },//微信分享
        },
        /* 用户订阅 */
        'Subscribe' : {
            'postSubscribe': {
                url: '/v3/find/subscribe',
                type: 'post',
                data: {
                    code:'',
                    mobile:'',
                    is_register:''
                }
            },//用户订阅
            'postSubscribe2': {
                url: '/v3/find/subscribe2',
                type: 'post',
                data: {                    
                }
            },//用户订阅
        },
        /* 积分商城 */
        'point' : {
            'get_pointrule': {
                url: '/v3/point/rule',
                type: 'get',
                data: {}
            },//获取积分规则
        },
        /* 商品详情 */
        'good' : {
            'get_good': {
                url: '/v3/commodity/commodity',
                type: 'get',
                data: {
                    commodity_id:''
                }
            },//获取商品详情
        },
        /* 应援活动分享 */
        'support' : {
            'get_support': {
                url: '/v4/support/info',
                type: 'get',
                data: {
                    support_id:''
                }
            },//获取应援活动详情
        },
        /* 途牛活动接口 */
        'tuniu' : {
            'tuniu_CheckCode': {
                url: '/v3/tuniu/check-code',
                type: 'post',
                data: {
                    code:'',
                    uuid:'1',
                }
            },
            'tuniu_RegUserinfo': {
                url: '/v3/tuniu/reg-userinfo',
                type: 'post',
                datatuniu: {
                    uuid:'1',
                    name:'',
                    mobile:'',
                    address:'',
                }
            },
        },
        /* 活动列表4.3 */
        'activityList' : {
            'getListData':{
                url : '/v5/eventing/all-event',
                type : 'get',
                data: {
                    page: '', 
                    page_size: '', 
                },
            },
            'getInfoData': {                
                url : '/v5/eventing/one-event',
                type : 'get',
                data: {
                    event_id: '', 
                },
            },//获取幸运专区详情数据
            'getShareData': {                
                url : '/v5/shareweibo/share-status',
                type : 'post',
                data: {
                    _vt: '',
                    event_id: '', 
                },
            },//获取转发状态
        },
        
    };

    exports('configAPI', interFace);
})