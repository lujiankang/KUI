<?php if (!defined('THINK_PATH')) exit();?>﻿<!DOCTYPE html>
<html>
<head>
	<title>KUI—Soo Easy</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link href="/KUI/KUI/Public/kui/style/kui.css" rel="stylesheet" />
	<script src="/KUI/KUI/Public/kui/k360-module.js"></script>
	<script src="/KUI/KUI/Public/kui/kui.js"></script>
</head>
<body>

	<!--
	 时间轴控件
		
		参数说明
			anim		动画效果(非必需)			slide-back：上下循环动画；slide-circle：向上滚动动画
			pause		动画暂停(非必需)			每当滚动一行时，会暂停滚动，等待一段时间后继续滚动，pause属性就是暂停的时间，单位：s
			speed		动画速度(非必需)			一个>1的数字，数值越小速度越快，数值越大速度月面
			src			资源位置(必需)				时间轴会从服务器地址src处获取数据。（*  不要写全路径，填写根路径后的路径，以/开头）
			reload		数据刷新时间(非必需)		每隔一段时间刷新一次数据，如果不填写则数据不刷新，单位：s

		自带函数
			reload			强制刷新列表
			clear			清空数据
			getDataById		通过数据的id获取数据
			
	-->
	<kui-timeline anim="slide-circle" speed="8" pause="2" src="/index.php/Home/Index/timelinedata" style="width:500px; height:250px; overflow:hidden" id="testTimeline">
		<!-- 标题 -->
		<kui-timeline-title>
			<kui-title>大家都在问</kui-title>
			<kui-number>4845644</kui-number>
			<kui-timeline-title-desc>你好，这是世界</kui-timeline-title-desc>
			<kui-more id="timelineRefresh">刷新</kui-more>
			<span class="clear"></span>
		</kui-timeline-title>
		<!-- Loading -->
		<kui-loading></kui-loading>
		<!-- 内容 -->
		<kui-timeline-content>
			<!--
				这里必须定义一段模板
					kbind="xxx"表示将服务器返回的xxx填写到该dom中
					_xxx表示将服务器返回的_xxx设置为该dom的xxx属性
			-->
			<kui-timeline-line>
				<kui-timeline-time kbind="time">2015-03-12</kui-timeline-time>				<!-- 该dom会自动生成一个time属性 -->
				<kui-timeline-text><a kbind="text" _href></a></kui-timeline-text>
				<kui-timeline-desc kbind="desc"></kui-timeline-desc>
				<span class="clear"></span>
			</kui-timeline-line>
			
		</kui-timeline-content>

	</kui-timeline>


	<!--
	 数据表格

		参数说明
			src			表格数据源（必须）				数据会自动从此处获得

		自带函数
			reload			强制刷新数据
			clear			清空表格
			getDataById		通过数据id获取数据
			onxxxxxxclick(data, e)			设置点击事件，参照说明

		说明：
			tr标签下可能有操作项，如果要响应操作，请绑定kclick属性，如：<button kclick="update">修改</button>，在点击的时候会调用onupdateclick方法，并传回数据
	-->
	<kui-datatable src="/index.php/Home/Index/datatabledata" style="margin-left:20px" id="testDataTable">
		<!-- 条件定义 -->
		<kui-datatable-condition>
			年级：<select type="text" name="grade">
				<option value="2015">2015</option>
				<option value="2016">2016</option>
				<option value="2017">2017</option>
			</select>
			&nbsp;&nbsp;&nbsp;
			检索：<input type="text" placeholder="输入关键字自动搜索" name="key" />
			<kui-datatable-reload>刷新</kui-datatable-reload>
			<span class="clear"></span>
		</kui-datatable-condition>
		<!-- 内容 -->
		<kui-datatable-content>
			<table cellpadding="0" cellspacing="0" class="kui-table-border-line">
				<thead>
					<tr>
						<td>姓名</td>
						<td>账号</td>
						<td>性别</td>
						<td width="80px">操作</td>
					</tr>
				</thead>
				<tbody>
					<!-- 需要克隆的数据 -->
					<tr>
						<td kbind="name">陆建康</td>
						<td kbind="number">114090102037</td>
						<td kbind="sex">男</td>
						<td>
							<a style="color:#3498DB" kclick="update">修改</a>
							<a style="color:#3498DB" kclick="delete">删除</a>
						</td>
					</tr>
				</tbody>
			</table>
			<kui-loading></kui-loading>
		</kui-datatable-content>

		<!-- 分页 -->
		<kui-datatable-pager>
			<button class="btn-link" pager="prev">上一页</button>
			<button class="btn-link" pager="next">下一页</button>
			<input type="text" pager="page" />
			<button class="btn-link" pager="goto">跳转</button>
			<span>第<span pager="cur">2</span>/<span pager="pages">3</span>/<span pager="count">6</span>页</span>
		</kui-datatable-pager>

	</kui-datatable>


	<!-- 
		数据加载中 
		dots表示点个数，点不能太多，如果不填，默认3个
	-->
	<kui-loading dots="4" dotstyle="background:#8E44AD" style="display:none"></kui-loading>



	<div></div>



</body>
</html>




<script>
	timelineRefresh.onclick = function () {
		testTimeline.reload();
	}
	
	testDataTable.onupdateclick = function (user) {
		console.log(user);
	}



</script>