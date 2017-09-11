layui.define([],function(exports){
 	var LS  = window.localStorage;
	var LSOBJ =  {
		set : function(key, value){
			//fixed iPhone/iPad 'QUOTA_EXCEEDED_ERR' bug
			if( this.get(key) !== undefined )
				this.remove(key);
			LS.setItem(key, value);
			this.length = LS.length;
		},
		//查询不存在的key时，有的浏览器返回null，这里统一返回undefined
		get : function(key){
			var v = LS.getItem(key);
			return v === null ? undefined : v;
		},
		remove : function(key){ LS.removeItem(key);this.length = LS.length; },
		clear : function(){ LS.clear();this.length = 0; },
		//本地存储数据遍历，callback接受两个参数 key 和 value，如果返回false则终止遍历
		each : function(callback){
			var list = this.obj(), fn = callback || function(){}, key;
			for(key in list)
				if( fn.call(this, key, this.get(key)) === false )
					break;
		},
		//返回一个对象描述的localStorage副本
		obj : function(){
			var list={}, i=0, n, key;
			if( LS.isVirtualObject ){
				list = LS.key(-1);
			}else{
				n = LS.length;
				for(; i<n; i++){
					key = LS.key(i);
					list[key] = this.get(key);
				}
			}
			return list;
		},
		length : LS.length
	};
	
	exports("localStorage" , LSOBJ);
 })
    