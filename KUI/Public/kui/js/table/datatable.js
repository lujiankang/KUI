k360_define(function () {
	var obj = {};

	//获取所有表格并显示
	function init() {
		var datatables = document.getElementsByTagName("kui-datatable");
		for (var i = 0; i < datatables.length; i++) {
			show(datatables.item(i));
		}
	}

	//显示一个表格
	function show(datatable) {
		datatable.condition = datatable.getElementsByTagName("kui-datatable-condition")[0];
		datatable.content = datatable.getElementsByTagName("kui-datatable-content")[0];
		datatable.pager = datatable.getElementsByTagName("kui-datatable-pager")[0];
		datatable.loading = datatable.getElementsByTagName("kui-loading")[0];
		//设置分页数据
		datatable.pages = 0;
		datatable.count = 0;
		datatable.curpage = 0;
		datatable.perpage = 0;
		//设置克隆tr
		datatable.tbody = datatable.content.getElementsByTagName("tbody")[0];
		var tr = datatable.tbody.getElementsByTagName("tr")[0];
		datatable.shower = tr.cloneNode(true);
		tr.parentElement.removeChild(tr);
		//分页事件
		datatable.pagerPrev = datatable.pager.querySelector("[pager='prev']");
		datatable.pagerNext = datatable.pager.querySelector("[pager='next']");
		datatable.pagerPage = datatable.pager.querySelector("[pager='page']");
		datatable.pagerGoto = datatable.pager.querySelector("[pager='goto']");
		datatable.pagerPages = datatable.pager.querySelector("[pager='pages']");
		datatable.pagerCur = datatable.pager.querySelector("[pager='cur']");
		datatable.pagerCount = datatable.pager.querySelector("[pager='count']");
		//默认设置一次分页
		setPager(datatable);

		datatable.pagerPrev.addEventListener("click", function () {
			//上一页
			if (datatable.curpage <= 0) return;
			load(datatable, datatable.curpage - 1);
		});
		datatable.pagerNext.addEventListener("click", function () {
			//下一页
			if (datatable.curpage >= datatable.pages - 1) return;
			load(datatable, datatable.curpage + 1);
		});
		datatable.pagerGoto.addEventListener("click", function () {
			//跳转
			var to = parseInt(datatable.pagerPage.value) - 1;
			if (isNaN(to) || to < 0 || to > datatable.pages - 1) return;
			console.log(datatable.pages - 1, to);
			load(datatable, to);
		});
		//条件处理
		var search = datatable.condition.querySelector("input[name='key']");
		var selects = datatable.condition.querySelectorAll("select[name]");
		for (var i = 0; i < selects.length; i++) {
			selects.item(i).onchange = function (e) {
				if (datatable.dataloading) {
					return false;
				}
				search && (search.value = "");
				load(datatable, 0);
			}
		}
		search && (search.onchange = function () {
			load(datatable, 0);
		});
		//刷新事件
		var reload = datatable.getElementsByTagName("kui-datatable-reload")[0];
		(reload && reload.addEventListener("click", function () {
			load(datatable, datatable.curpage);
		}));
		//加载一次数据
		load(datatable, 0);
		//设置函数
		setFunc(datatable);
	}

	//设置函数
	function setFunc(datatable) {
		//强制刷新表格
		datatable.reload = function () {
			load(datatable, datatable.curpage);
		}
		//通过id获取数据
		datatable.getDataById = function (id) {
			var trs = datatable.tbody.children;
			for (var i = 0; i < trs.length; i++) {
				var tr = trs.item(i);
				if (tr.tableData[id] == id)
					return tr.tableData;
			}
		}
		//清空数据
		datatable.clear = function () {
			while (datatable.tbody.children.length > 0) {
				datatable.tbody.removeChild(datatable.tbody.children[0]);
			}
		}
	}

	//设置操作事件
	function setEvent(datatable) {
		//获取处理
		var trs = datatable.tbody.children;
		for (var i = 0; i < trs.length; i++) {
			var tr = trs.item(i);
			evt(tr);
		}
		//事件
		function evt(tr){
			var handles = tr.querySelectorAll("[kclick]");
			for (var j = 0; j < handles.length; j++) {
				var handle = handles.item(j);
				handle.onclick = function (e) {
					var kclick = this.getAttribute("kclick");
					var func = "on" + kclick + "click";
					if (datatable[func])
						return datatable[func].apply(this, [tr.tableData, e]);
					return true;
				}
			}
		}
	}

	//设置分页
	function setPager(datatable) {
		datatable.pagerPages.innerHTML = datatable.pages;
		datatable.pagerCur.innerHTML = datatable.curpage + 1;
		datatable.pagerCount.innerHTML = datatable.count;
		if (datatable.curpage <= 0)
			datatable.pagerPrev.disabled = true;
		else datatable.pagerPrev.disabled = false;
		if (datatable.curpage + 1 >= datatable.pages)
			datatable.pagerNext.disabled = true;
		else datatable.pagerNext.disabled = false;
	}

	//加载数据
	function load(datatable, page) {
		if (datatable.dataloading) return false;
		datatable.dataloading = true;
		var url = datatable.getAttribute("src");
		var postdata = { page: page };
		var conditionDoms = datatable.condition.querySelectorAll("[name]");
		for (var i = 0; i < conditionDoms.length; i++) {
			var name = conditionDoms.item(i).getAttribute("name");
			var value = conditionDoms.item(i).value;
			postdata[name] = value;
		}
		//loading
		datatable.loading.style.display = "block";
		datatable.loading.style.padding = "50px 0px";
		//清空并填写数据
		while (datatable.tbody.children.length > 0) {
			datatable.tbody.removeChild(datatable.tbody.children[0]);
		}
		k360_ajax(url, "post", postdata, true, function (status, text, xhr) {
			if (status != 200) {
				return;
			}
			try {
				var data = JSON.parse(text);
				if (data.reson) {
					return;
				} else {
					var datas = data.data;
					showData(datatable, data.data, page);
				}
			} catch (err) {
				console.error(err);
			}
			datatable.dataloading = false;
			datatable.loading.style.display = "none";
		});
	}

	//显示数据
	function showData(datatable, webret, curpage) {
		//设置数据
		datatable.pages = webret.pages;
		datatable.count = webret.count;
		datatable.curpage = curpage;
		datatable.perpage = webret.perpage;
		var datas = webret.datas;
		for (var i in datas) {
			var aData = datas[i];
			var dom = datatable.shower.cloneNode(true);
			dom.tableData = aData;
			k360_attr_setter(dom, aData);
			datatable.tbody.appendChild(dom);
		}
		//设置分页
		setPager(datatable);
		//设置事件
		setEvent(datatable);
	}

	init();

	return obj;
});