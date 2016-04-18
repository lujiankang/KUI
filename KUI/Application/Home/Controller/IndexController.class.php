<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
	
	/**
	 * 通过ajax返回成功数据
	 * @param string|array $data		成功数据
	 */
	public function ajaxSuccess($data){
		header("Content-type:application/json");
		echo json_encode(array("data"=>$data));
	}
	
	/**
	 * 通过ajax返回失败原因
	 * @param string $reson		失败原因
	 */
	public function ajaxError($reson){
		header("Content-type:application/json");
		echo json_encode(array("reson"=>$reson));
	}
	
	
	public function index(){
		$this->display();
	}
	
	
	
	public function timelinedata(){
		$data = array(
			array(
				"id"		=>	1,
				"time"		=>	date("Y-m-d H:i:s", time()),
				"text"		=>	"附近的看法反动势力发射点犯得上犯得上",
				"_href"		=>	"http://www.qq.com",
				"desc"		=>	"阿凡达发"
			),
			array(
				"id"		=>	2,
				"time"		=>	"2015-04-17",
				"text"		=>	"开发商发射啊是的发到付大幅放法反对分开发商发射啊是的发到付大幅放法反对分",
				"_href"		=>	"#",
				"desc"		=>	"他死了他死了他死了他死了他死了他死了他死了他死了他死了"
			),
			array(
				"id"		=>	3,
				"time"		=>	"2015-03-12",
				"text"		=>	"附近的看法反动势力发射点犯得上犯得上",
				"_href"		=>	"#",
				"desc"		=>	"阿凡达发"
			),
			array(
				"id"		=>	4,
				"time"		=>	"2015-03-14",
				"text"		=>	"开发商发射啊是的发到付大幅放法反对分",
				"_href"		=>	"#",
				"desc"		=>	"他死了"
			),array(
				"id"		=>	5,
				"time"		=>	"2015-03-12",
				"text"		=>	"附近的看法反动势力发射点犯得上犯得上",
				"_href"		=>	"#",
				"desc"		=>	"阿凡达发"
			),
			array(
				"id"		=>	6,
				"time"		=>	"2015-03-14",
				"text"		=>	"开发商发射啊是的发到付大幅放法反对分",
				"_href"		=>	"#",
				"desc"		=>	"他死了"
			),
		);
		self::ajaxSuccess($data);
	}
	
	
	
	public function datatabledata($page, $key, $grade){
		$data = array(
			array(
				"id"		=>	1,
				"name"		=>	"陆建康($page-$grade)",
				"number"	=>	"114090102037$key",
				"sex"		=>	"男"
			),
			array(
				"id"		=>	1,
				"name"		=>	"苟怡($page-$grade)",
				"number"	=>	"114090102012$key",
				"sex"		=>	"女"
			),
			array(
				"id"		=>	1,
				"name"		=>	"赵泽颖($page-$grade)",
				"number"	=>	"124090102007$key",
				"sex"		=>	"女"
			),
			array(
				"id"		=>	1,
				"name"		=>	"黄文波($page-$grade)",
				"number"	=>	"114090103023$key",
				"sex"		=>	"男"
			),
			array(
				"id"		=>	1,
				"name"		=>	"林禄福($page-$grade)",
				"number"	=>	"114090101045$key",
				"sex"		=>	"男"
			),
		);
		$ret = array(
			"datas"			=>	$data,
			"perpage"		=>	20,
			"pages"			=>	5,
			"count"			=>	95
		);
		self::ajaxSuccess($ret);
	}
	
}