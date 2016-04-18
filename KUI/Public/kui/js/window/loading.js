k360_define(function () {
	var obj = {};

	function init() {
		var loadings = document.getElementsByTagName("kui-loading");
		for (var i = 0; i < loadings.length; i++) {
			show(loadings.item(i));
		}
	}

	function show(loading) {
		//获取点数
		var num = parseInt(loading.getAttribute("dots"));
		if (!num) num = 3;
		//获取样式
		var style = loading.getAttribute("dotstyle");
		for (var i = 0; i < num; i++) {
			var dot = document.createElement("kui-loading-dot");
			dot.setAttribute("style", style);
			loading.appendChild(dot);
		}

		var dots = loading.children;
		for (var i = 0; i < dots.length; i++) {
			setTimeout(function (dot) {
				dotAnim(loading, dot);
			}, i * 300, dots[i]);
		}
	}

	function dotAnim(loading, dot) {
		var x = 0;		//坐标
		var o = 0;		//透明度
		var time = 0;	//时间
		var v = 0;		//速度
		//获取基本信息
		var width = loading.clientWidth / 4;			//单宽
		var basespeed = width;		//基础速度
		var width2 = width * 2;			//2倍单宽
		var width3 = width * 3;			//3倍
		var width4 = width * 4;			//4倍
		//开起动画
		setInterval(function () {
			if (loading.style.display == "none") return;
			//时间自增
			time += 1;
			//到最后
			if (time == width4) {
				time = 0;
				x = 0;
			}
			//点运动
			if (time <= width) {
				v = basespeed + (time - width) * (time - width) / (width / 7);
				x += v;
				o = 1;
			} else if (time > width && time <= width2) {
				v = basespeed;
				x += v;
				o = 1;
			} else if (time > width2 && time <= width3) {
				v = basespeed + (time - width2) * (time - width2) / (width / 7);
				x += v;
				o = 1;
			} else {
				x = 0;
				o = 0;
			}
			//设置属性
			dot.style.left = x / width2 + "px";
			dot.style.opacity = o;
		}, 1);
	}

	init();

	return obj;
});