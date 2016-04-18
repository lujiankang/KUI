/*
功能：为某个dom设置内容
参数：
	dom			要设置内容的dom
	data		要设置的内容
说明：
	如果要设置innerHTML，加入属性[kbind='xxxxx']，如：姓名是<span kbind="name"></span>
	如果要设置属性，请加入属性_xxxx，如<a kbind='name' _href></a>
*/
function k360_attr_setter(dom, data) {
	for (var i in data) {
		var selector = (i[0] == "_") ? "[" + i + "]" : "[kbind='" + i + "']";
		var items = dom.querySelectorAll(selector);
		for (var j = 0; j < items.length; j++) {
			var item = items[j];
			if (i[0] == "_") {
				var attr = i.substr(1);
				item.setAttribute(attr, data[i]);
			} else {
				item.innerHTML = data[i];
			}
		}
	}
}



//获取项目目录
function k360_root() {
	var path = window.location.href;
	path = path.replace(/#/gim, "");
	var index = path.indexOf("index.php");
	index = (index == -1) ? path.length : index;
	var _root = path.substring(0, index);
	if (_root.charAt(_root.length - 1) == "/") {
		_root = _root.substring(0, _root.length - 1);
	}
	return _root;
}



/*
功能：ajax操作
参数：
	url				请求地址，相对于根，如："/index.php/xxx/xx/xx...."
	method			请求方式
	params			请求参数，可以是{xxx:xxx, ...}，也可以是一个表单
	async			是否异步
	callback		请求回调  Function(status, responsText, xhr)
*/
function k360_ajax(url, method, params, async, callback) {
	
	//表单数据
	function kData() {
		var datas = null;
		if (window.FormData) {
			datas = new FormData();
		} else {
			datas = [];
		}
		//添加数据
		this.append = function (name, data) {
			if (window.FormData) {
				datas.append(name, data);
			} else {
				datas.push(escape(name + "=" + data));
			}
		}
		//获取数据
		this.getdatas = function () {
			if (window.FormData) {
				return datas;
			} else {
				return datas.join("&");
			}
		}
	}

	//表单序列化
	function kForm(form) {
		//		alert(form.children[0]);
		var data = [];
		var items = document.querySelectorAll("[name]");
		for (var i = 0; i < items.length; i++) {
			var item = items.item(i);
			if (item instanceof HTMLInputElement) {
				//文本输入框
				var name = item.getAttribute("name");
				var value = item.value;
				var type = item.type;
				if (type == "checkbox" || type == "radio") {
					item.checked && (data.push({name:name, value:value}));
				} else if (type == "file") {
					//var files = item.files;
					for (var j = 0; j < item.files.length; j++) {
						data.push({ name: name, value: item.files[j] });
					}
				} else {
					data.push({ name: name, value: value });
				}
			} else if (item instanceof HTMLSelectElement) {
				//下拉列表
				var name = item.getAttribute("name");
				var options = item.querySelectorAll("option");
				for (var j = 0; j < options.length; j++) {
					var option = options.item(j);
					var value = option.value;
					option.selected && (data.push({ name: name, value: value }));
				}
			} else {
				//其他
				var name = item.getAttribute("name");
				var value = item.value;
				data.push({ name: name, value: value });
			}
		}
		return data;
	}


	//创建对象
	var postData = new kData();

	//填充数据
	if (params instanceof HTMLFormElement) {
		//表单填充
		var sData = kForm(params);
		for (var i in sData) {
			var name = sData[i].name;
			var value = sData[i].value;
			postData.append(name, value);
		}
	} else {
		//直接填充
		for (var i in params) {
			postData.append(i, params[i]);
		}
	}

	//数据发送
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			var status = xhr.status;
			if (status >= 200 && status < 300) {
				callback && callback(status, xhr.responseText, xhr);
			} else {
				callback && callback(status, xhr.responseText, xhr);
				console.error("ajax错误，状态码：" + status + "，XHR：\r\n", xhr);
			}
		}
	}
	xhr.open(method.toUpperCase(), k360_root() + url, async);
	xhr.send(postData.getdatas());
}



/*
模块定义
参数：
	func		模块
说明：
	格式如下：
	k360_define(function(){
		
	});
*/
function k360_define(func) {
	return func;
}



/*
模块导入
参数：
	modules		要导入的模块，可以是一个，也可以是多个，格式有：
					1、直接填写模块名称，如：["module1", "module2", ...]， 
					2、如果只有一个模块，可直接写入字符串，如："mymodule"
	jsPath		相对于根目录的path
	callback	回调函数，返回所导入的模块，依旧是k360_define(func)中，func函数的返回值

*/
function k360_require(modules, jsPath, callback) {

	var ajaxCount = 0;			//ajax执行次数计数器

	//AJAX————async是否异步
	function ajax(url, async, successCB) {
		if (window.XMLHttpRequest) {
			var xhr = new XMLHttpRequest();
		} else {
			var xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				ajaxCount++;
				var status = xhr.status;
				if (status >= 200 && status < 300) {
					successCB && successCB(xhr.responseText);
				} else {
					console.error("ajax错误，状态码：" + status + "，XHR：\r\n", xhr);
				}
			}
		}
		xhr.open("GET", url, async);
		xhr.send(null);
	}

	//加载模型
	function load(module, successCB) {
		var url = k360_root() + "/" + jsPath + "/" + module + ".js";
		var text = "";
		ajax(url, true, function (data) {
			text = data;
			try{
				var moduleObj = eval(text).apply(window);
				successCB(module, moduleObj);
			} catch (err) {
				console.error("加载模块出错", err);
			}
		});
	}

	var arr = {};
	var ret = [];
	//开始
	if (typeof modules == "string") {
		load(modules, function (modulename, moduledata) {
			callback && callback.apply(window, moduledata);
		});
	} else {
		for (var i in modules) {
			arr[modules[i]] = null;
			load(modules[i], function (modulename, moduledata) {
				arr[modulename] = moduledata;
				if (ajaxCount == modules.length) {
					//返回数据
					for (var j in arr) {
						ret.push(arr[j]);
						callback && callback.apply(window, ret);
					}
				}
			});
		}
	}
}




/*

//Demo

------module1.js--------
k360_define(function(a){
	var obj = {};
	obj.test = function(){
		return "this is module1";
	}
	return obj;
});



------module2.js--------
k360_define(function(){
	var obj = {};
	obj.sayHello = function(name){
		alert("Hello everyone, I am " + name);
	}
	return obj;
});


------module3.js--------
k360_define(function(str, user){
	var obj = {};
	obj.test = function(){
		alert(str + " " + user);
	}
	return obj;
});



----------测试1------------
k360_require({"module1":null, "module2":null}, "scripts", function (m1, m2) {
	alert(m1.test());			//this is module1
	m2.sayHello("Mary");		//Hello everyone, I am Mary
});


----------测试2------------
k360_require("module2", "scripts").sayHello("Jack");			//Hello everyone, I am Jack



----------测试3------------
k360_require({ "module3": ["hello world"] }, "scripts").test("HaHa");			//hello world HaHa
k360_require({ "module3": "hello world" }, "scripts").test("HaHa");			//hello world HaHa
*/