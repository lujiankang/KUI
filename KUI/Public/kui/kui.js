window.addEventListener("load", function () {

	//窗口部分
	k360_require(["loading"], "Public/kui/js/window");

	k360_require(["popover"], "Public/kui/js/window", function (popover) {
		window.popover = popover;
	});


	//列表部分
	k360_require(["timeline"], "Public/kui/js/list");





	//表格部分
	k360_require(["datatable"], "Public/kui/js/table");




});


/*
输入框处理
*/
window.kinput = {
	onfocus: function () {
		this.parentElement.setAttribute("editing", true);
	},

	onblur: function () {
		var topinput = this.parentElement;
		topinput.removeAttribute("editing");
		if (!this.value) {
			topinput.removeAttribute("texting");
			topinput.setAttribute("erroring", true);
		} else {
			topinput.setAttribute("texting", true);
			if (check(this.value, topinput.getAttribute("type"))) {
				topinput.removeAttribute("erroring");
			} else {
				topinput.setAttribute("erroring", true);
			}
		}

		function check(str, type) {
			if (!type) return true;
			var dict = {
				email: /[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]+/gim,
			};
			var reg = dict[type];
			if (!reg) return false;
			return reg.test(str);
		}
	}
};


