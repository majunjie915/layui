/**
 * 播放音频
 *
 * @author zhangpeng
 * @date 2012-9-14
 */

define(function(require) {
	var isCreated;
	var isReady;
	var errorMsg;
	var webSound;
	var flashObj;

	function checkReady(id, property) {
		flashObj = T.swf.getMovie(id);
		var timer = setInterval(function() {
			try {
				if (flashObj[property]) {
					isReady = true;
					clearInterval(timer);
				}
			} catch(_) { }
		}, 100);
	}

	function createFlashObj() {
		var flashId = T.lang.guid();
		var html = T.swf.createHTML({
			id: flashId,
			url: '/swf/WebSound.swf',
			width: 20,
			height: 20,
			ver: '8'
		});
		if (html) {
			T.dom.insertHTML(document.body, 'beforeEnd', html);
			checkReady(flashId, '_play');
		} else {
			errorMsg = '请升级 Flash！';
		}
	}

	function play(url, id) {
		if (isReady) {
			flashObj._play(url, id);
		} else if (errorMsg) {
			return errorMsg;
		} else {
			log('waitting flash to ready ...');
			setTimeout(function() {
				play(url, id);
			}, 100);
		}
	}

	function WebSound() { }

	T.extend(WebSound.prototype, require('./event'), {
		play: function(url, id) {
			if (!isCreated) {
				isCreated = true;
				createFlashObj();
			}
			var msg;
			try {
				msg = play(url, id);
			} catch (e) {
				msg = '无法播放音频，请重试';
			}
			if (msg) {
				this.fire('fail', id, msg);
			}
		}
	});

	window.flashLog = SRX.log;

	// 下载完成，开始播放
	window.webSound_start = function(id) {
		// 用 setTimeout 使 flash 调用尽快返回
		setTimeout(function() {
			webSound.fire('start', id);
		}, 0);
		return true;
	};

	// 停止播放
	window.webSound_stop = function(id) {
		setTimeout(function() {
			webSound.fire('stop', id);
		}, 0);
		return true;
	};

	// 下载失败
	window.webSound_fail = function(id) {
		setTimeout(function() {
			webSound.fire('fail', id, '无法加载音频文件');
		}, 0);
		return true;
	};

	function log(s) {
		SRX.log(s);
	}

	var webSound = new WebSound();
	return webSound;
});

