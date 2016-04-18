/*
模块：html时间线
创建时间：2016-04-07
创建人：酸草莓
说明：
	时间线动画定义： anim="slide-circle"，动画有：
		循环向上滚动			slide-circle
		向上滚动然后向下滚动	slide-back
	滚动过程中带停顿定义：pause="3"，参数单位：s
*/
k360_define(function () {
	var obj = {};

	var timelines = null;

	/*
	刷新时间线
	*/
	function init() {
		timelines = document.getElementsByTagName("kui-timeline");
		for (var i = 0; i < timelines.length; i++) {
			show(timelines.item(i));
		}
	}

	//显示数据
	function show(timelinedom) {
		var height = timelinedom.clientHeight;
		var inHeight = timelinedom.scrollHeight;
		//loading
		timelinedom.loading = timelinedom.getElementsByTagName("kui-loading")[0];
		//获取动画属性
		var anim = timelinedom.getAttribute("anim");			//动画
		var pause = timelinedom.getAttribute("pause");			//暂停时间
		pause = pause ? parseInt(pause) : 0;
		var speed = timelinedom.getAttribute("speed");			//速度
		var speed = speed ? ((parseInt(speed) == 0) ? 70 : parseInt(speed)) : 70;
		if (anim)
			anim_slide(timelinedom, anim, speed, pause);			//执行动画

		//获取加载数据
		var reload = timelinedom.getAttribute("reload");
		reload = reload ? parseInt(reload) : 0;
		src(timelinedom);
		//加载间隔，至少大于5s
		if (reload >= 5) {
			setInterval(function () {
				src(timelinedom);
			}, reload * 1000);
		}
		//鼠标移入和移出操作
		timelinedom.addEventListener("mouseover", function () {
			this.setAttribute("scroll-pause", "true");
		});
		timelinedom.addEventListener("mouseout", function () {
			this.removeAttribute("scroll-pause");
		});


		//回调函数设置
		setFunc(timelinedom);
	}

	//设置函数
	function setFunc(timelinedom) {
		//重新加载数据
		timelinedom.reload = function () {
			src(timelinedom);
		}
		//清除数据
		timelinedom.clear = function () {
			while (container.children.length > 0) {
				container.removeChild(container.children[0]);
			}
		}
		//通过id获取数据，前提是有id
		timelinedom.getDataById = function (id) {
			var container = timelinedom.getElementsByTagName("kui-timeline-content")[0];
			for (var i = 0; i < container.children.length; i++) {
				var data = container.children[i].timelineData;
				if (data && timelineData.id && timelineData.id == id) return data;
			}
			return null;
		}
	}

	//格式化时间
	function timefomat(str) {
		//分割
		str = str.split(/ |:|-/gim);
		for (var i in str) {
			str[i] = parseInt(str[i]);
		}
		//创建日期
		var old = new Date();
		old.setYear(str[0]);
		old.setMonth(str[1] - 1);
		str[2] && old.setDate(str[2]);
		str[3] && old.setHours(str[3]);
		str[4] && old.setMinutes(str[4]);
		str[5] && old.setSeconds(str[5]);
		var cur = new Date();
		//技术按时间差
		var seconds = parseInt((cur.getTime() - old.getTime()) / 1000);		//相差秒数
		var minuts = parseInt(seconds / 60);
		var hours = parseInt(minuts / 60);
		var days = parseInt(hours / 24);
		//分析
		if (days > 0) {
			var dict = ["昨天", "前天"];
			if (days > 2) return days + "天前";
			return dict[days - 1];
		}
		if (hours > 0) return hours + "小时前";
		if (minuts > 2) return minuts + "分钟前";
		return "刚刚";
	}

	//执行资源操作
	function src(timelinedom) {
		if (timelinedom.dataLoading) return;
		timelinedom.dataLoading = true;
		//先克隆数据
		if (!timelinedom.shower) {
			var dom = timelinedom.getElementsByTagName("kui-timeline-line")[0];
			timelinedom.shower = dom.cloneNode(true);
			dom.parentElement.removeChild(dom);
		}
		var container = timelinedom.getElementsByTagName("kui-timeline-content")[0];
		while (container.children.length > 0) {
			container.removeChild(container.children[0]);
		}
		timelinedom.loading && (timelinedom.loading.style.display = "block");
		//加载数据
		var url = timelinedom.getAttribute("src");
		k360_ajax(url, "post", null, true, function (status, text, xhr) {
			timelinedom.loading && (timelinedom.loading.style.display = "none");
			timelinedom.dataLoading = false;
			if (status != 200) {
				return;
			}
			try{
				var data = JSON.parse(text);
				if (data.reson) {
					return ;
				} else {
					var datas = data.data;
					showData(datas);
				}
			} catch (err) {
				//
			}
		});

		function showData(datas) {
			for (var i in datas) {
				var aData = datas[i];
				var dom = timelinedom.shower.cloneNode(true);
				dom.timelineData = aData;
				k360_attr_setter(dom, aData);
				//设置显示时间
				var timedom = dom.getElementsByTagName("kui-timeline-time")[0];
				timedom.setAttribute("time", timefomat(aData.time))
				timedom.innerHTML = "";
				container.appendChild(dom);
			}
		}
	}

	//执行滚动动画
	function anim_slide(timeline, anim, speed, pause) {
		var head = timeline.getElementsByTagName("kui-timeline-title")[0];
		var dom = timeline.getElementsByTagName("kui-timeline-content")[0];
		var domHeight = timeline.clientHeight - head.clientHeight;
		dom.style.height = domHeight + "px";
		dom.style.overflow = "hidden";
		var dir = 1;
		var go = true;
		setInterval(function () {
			if (!go) return;				//不允许动画
			if (timeline.hasAttribute("scroll-pause")) return;						//鼠标移入
			if (dom.children.length <= 0) return;									//没有数据
			if (dom.scrollTop == 0 && dom.scrollHeight == domHeight) return;		//数据太少
			var lineH = dom.children[0].clientHeight;
			dom.scrollTop += dir;
			//滚动到顶部/底部
			if (dom.scrollHeight == dom.scrollTop + domHeight) {
				if (anim == "slide-circle") {
					//循环滚动动画
					dom.appendChild(dom.children[0]);
					dom.scrollTop -= lineH;
				} else {
					//回滚动画
					dir = -1;
				}
			} else if (dom.scrollTop == 0) {
				dir = 1;
			}
			//滚动玩一个
			var div = dom.scrollTop/lineH;
			if (div == parseInt(div)) {
				go = false;
				setTimeout(function () {
					go = true;
				}, pause * 1000);
			}
		}, speed);
	}

	init();


	return obj;
});