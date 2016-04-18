k360_define(function () {
	var obj = {};
	var radioIndex = 1;

	//alert弹窗
	obj.alert = function (text, ok) {
		return showAlertConfirm(null, text, ok, false);
	}
	//带有title的alert弹窗
	obj.alertEx = function (title, text, ok) {
		return showAlertConfirm(title, text, ok, false);
	}
	//confirm弹窗
	obj.confirm = function (text, ok, cancel) {
		return showAlertConfirm(null, text, ok, cancel);
	}
	//带title的confirm弹窗
	obj.confirmEx = function (title, text, ok, cancel) {
		return showAlertConfirm(title, text, ok, cancel);
	}

	//显示一个提示框
	obj.tip = function (text, color) {
		if (!color) color = "#333";
		var dom = createDom("div", {
			position: "fixed",
			bottom: "-60px",
			minWidth: "200px",
			maxWidth: "600px",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			lineHeight: "60px",
			background:"#FFF",
			border:"solid 1px #AAA",
			textAlign: "center",
			padding: "0px 10px",
			zIndex: 1000,
			boxShadow: "0px 6px 20px #AAA",
			transition: "all 0.5s",
			color: color
		});
		dom.innerHTML = text;
		setTimeout(function () {
			dom.style.left = (window.innerWidth - dom.offsetWidth) / 2 + "px";
			dom.style.bottom = "100px";
		}, 100);
		setTimeout(function () {
			dom.style.opacity = 0;
			setTimeout(function () {
				document.body.removeChild(dom);
			}, 500);
		}, 4000);
		document.body.appendChild(dom);
	}

	//显示一个checkbox弹窗
	obj.kcheck = function (title, data) {
		return showCheckRadio(title, "checkbox", data);
	}
	//显示一个radio弹窗
	obj.kradio = function (title, data) {
		return showCheckRadio(title, "radio", data);
	}

	//显示一个loading
	obj.loading = function (text) {
		var loadingObj = {};
		var shadow = Shadow();
		document.body.appendChild(shadow);
		var main = loadingMain(text);
		shadow.appendChild(main);
		main.style.top = (window.innerHeight - main.offsetHeight) / 3 + "px";
		//删除loading
		loadingObj.distroy = function () {
			document.body.removeChild(shadow);
		}
		return loadingObj;
	}



	//加载中主窗口
	function loadingMain(text) {
		text || (text = "");
		var dom = createDom("div", {
			position: "absolute",
			left: "0px",
			top: "0px",
			padding: "60px 0px",
			right: "0px",
			background:"#FFF",
			textAlign: "center",
			fontSize: "20px",
			color: "#2980B9"
		});
		var loadingImg = createDom("div", {
			width: "32px",
			height: "32px",
			letterSpacing: "3px",
			fontSize: "20px",
			color: "#333",
			fontWeight: "bold",
			lineHeight: "50px",
			verticalAlign: "middle",
			marginRight: "20px"
		});
		loadingImg.className = "loading-gif-image";

		dom.appendChild(loadingImg);
		dom.appendChild(document.createTextNode(text));
		return dom;
	}

	//显示选择弹窗
	function showCheckRadio(title, type, data) {
		var checkObj = { onok: function (cb) { checkObj["_onok"] = cb; return checkObj; }, oncancel: function (cb) { checkObj["_oncancel"] = cb; return checkObj; } };
		var shadow = Shadow();
		document.body.appendChild(shadow);
		
		var main = checkMainDom(title, type, data);
		shadow.appendChild(main);
		//操作
		var handles = alertHandle("确定", "取消");
		main.appendChild(handles);
		handles.okdom.style.opacity = 0.5;
		handles.okdom.style.cursor = "not-allowed";
		//居中
		main.style.left = (window.innerWidth - main.offsetWidth) / 2 + "px";
		main.style.top = (window.innerHeight - main.offsetHeight) / 3 + "px";
		//更改事件
		ON(main.querySelectorAll("input"), "change", function () {
			var num = main.querySelectorAll("input:checked").length;
			if (num == 0) {
				handles.okdom.style.opacity = 0.5;
				handles.okdom.style.cursor = "not-allowed";
			} else {
				handles.okdom.style.opacity = 1;
				handles.okdom.style.cursor = "pointer";
			}
		});
		//完成事件
		handles.okdom.onclick = function () {
			if (this.style.opacity == 0.5) return;
			if (checkObj["_onok"]) {
				var ret = [];
				var checkeddom = main.querySelectorAll("input:checked");
				for (var i = 0; i < checkeddom.length; i++) {
					ret.push(checkeddom.item(i).value);
				}
				checkObj["_onok"](type == "checkbox" ? ret : ret[0]);
			}
			document.body.removeChild(shadow);
		}
		handles.canceldom.onclick = function () {
			if (checkObj["_oncancel"])
				checkObj["_oncancel"]();
			document.body.removeChild(shadow);
		}
		return checkObj;
	}

	//选择弹窗主窗口
	function checkMainDom(title, type, data) {
		//基本dom
		var dom = createDom("div", {
			position: "absolute",
			width: "220px",
			left: "204px",
			top: "100px",
			padding: "40px 60px",
			background: "#FFF",
			boxShadow: "0px 30px 60px #AAA",
			borderRadius: "5px",
			fontFamily: "微软雅黑",
			cursor: "default"
		});
		//标题
		var titleDom = createDom("div", {
			fontSize: "20px",
			fontWeight: "600",
			color: "#333",
		});
		titleDom.innerHTML = title;
		dom.appendChild(titleDom);
		//内容
		var itemsdom = createDom("div", {
			marginTop: "15px",
			lineHeight: "35px",
			fontSize: "18px",
			maxHeight: "250px",
			overflow: "auto",
			overflowX: "hidden"
		});
		dom.appendChild(itemsdom);
		radioIndex++;
		for (var i in data) {
			var containerdom = createDom("label", {
				display: "block",
				whiteSpace: "nowrap",
				overflow: "hidden",
				textOverflow: "ellipsis"
			});
			itemsdom.appendChild(containerdom);
			var inputdom = createDom("input", {
				width: "17px",
				marginRight: "20px"
			});
			inputdom.type = type;
			inputdom.value = data[i].id;
			inputdom.name = "check" + radioIndex;
			containerdom.appendChild(inputdom);
			containerdom.appendChild(document.createTextNode(data[i].name));
		}
		
		return dom;
	}

	//弹窗主要操作
	function showAlertConfirm(title, text, ok, cancel) {
		var alertObj = { onok: function (cb) { alertObj["_onok"] = cb; return alertObj; }, oncancel: function (cb) { alertObj["_oncancel"] = cb; return alertObj; } };
		//背景
		var shadow = Shadow();
		document.body.appendChild(shadow);
		//标题、文本及主窗口
		var main = alertMainDom(title, text);
		shadow.appendChild(main);
		//操作
		var handles = alertHandle(ok, cancel);
		main.appendChild(handles);
		//居中
		main.style.left = (window.innerWidth - main.offsetWidth) / 2 + "px";
		main.style.top = (window.innerHeight - main.offsetHeight) / 3 + "px";
		//事件
		handles.okdom.onclick = function () {
			if (alertObj["_onok"])
				alertObj["_onok"]();
			document.body.removeChild(shadow);
		}
		handles.canceldom && (handles.canceldom.onclick = function () {
			if (alertObj["_oncancel"])
				alertObj["_oncancel"]();
			document.body.removeChild(shadow);
		});
		return alertObj;
	}

	//弹窗按钮
	function alertHandle(ok, cancel) {
		//文字
		ok = ok ? ok : "确定";
		if(cancel !== false)
			cancel = cancel ? cancel : "取消";
		//基本dom
		var dom = createDom("div", {
			marginTop: "50px",
			color: "#2196f3",
			textAlign: "right",
			fontSize: "20px"
		});
		//取消
		if (cancel) {
			var canceldom = createDom("div", {
				display: "inline-block",
				cursor: "pointer",
				padding: ""
			});
			canceldom.innerHTML = cancel;
			dom.appendChild(canceldom);
			dom.canceldom = canceldom;
		}
		//确定
		var okdom = createDom("div", {
			display: "inline-block",
			cursor: "pointer",
			padding: "",
			marginLeft: "40px"
		});
		okdom.innerHTML = ok;
		dom.appendChild(okdom);
		dom.okdom = okdom;
		return dom;
	}

	//弹窗主窗口
	function alertMainDom(title, text) {
		//基本dom
		var dom = createDom("div", {
			position: "absolute",
			width: "320px",
			left: "204px",
			top: "100px",
			padding: "40px 60px",
			background: "#FFF",
			boxShadow: "0px 30px 60px #AAA",
			borderRadius: "5px",
			fontFamily: "微软雅黑",
			cursor: "default"
		});
		//标题
		if (title && title != "") {
			var titleDom = createDom("div", {
				fontSize: "20px",
				fontWeight: "600",
				color: "#333",
			});
			titleDom.innerHTML = title;
			dom.appendChild(titleDom);
		}
		//文本
		var textDom = createDom("div", {
			fontSize: "18px",
			color: "#888",
			marginTop: "15px"
		});
		textDom.innerHTML = text;
		dom.appendChild(textDom);

		return dom;
	}

	//阴影
	function Shadow() {
		return createDom("div", {
			position: "fixed",
			left: "0px",
			top: "0px",
			right: "0px",
			bottom: "0px",
			background: "rgba(235, 235, 235, 0.8)",
			userSelect: "none",
			"-webkit-user-select": "none",
			"-moz-user-select": "none",
			"-ms-user-select": "none",
		});
	}

	//创建dom
	function createDom(name, css) {
		var dom = document.createElement(name);
		CSS(dom, css);
		return dom;
	}

	//设置dom的css
	function CSS(dom, css) {
		for (var i in css) {
			dom.style[i] = css[i];
		}
	}


	function ON(doms, event, callback) {
		for (var i = 0; i < doms.length; i++) {
			doms.item(i)["on" + event] = callback;
		}
	}

	return obj;
});