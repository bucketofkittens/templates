$(document).ready(function() {

	function proportion() {
		$("body #content > ul > li, body #content > ul").css("height", $(window).height()-300);
		$("body #content > ul").css("width", ($(window).height()-300)*2.9);
	}

	$(window).resize(function() {
		proportion();
	});

	proportion();

	var texts = {
		"project": "Холдинг объединяет <br />высокотехнологичные компании, <br />успешно работающие на IT-рынке <br />Российской Федерации",
		"client": "Компании Холдинга заслужили высокую репутацию как надежные поставщики, обладающие глубокой профессиональной экспертизойв сфере системной интеграции, разработки программного обеспеченияна заказ и информатизации целого ряда отраслей",
		"contact": "Сегодня компании Холдинга представлены в трех крупнейших субъектахРоссийской Федерации: в Москве, Санкт-Петербурге и Новосибирской области. Представительства компаний группы, партнеры и агенты работают на всей территории Российской Федерации."
	};

	$("body #content ul li").on("click", function() {
		$("body #content ul li").removeClass("current");
		$(this).addClass("current");

		$("header nav a").removeClass("current");
		$("header nav a[target='"+$(this).attr("id")+"']").addClass("current");

		$("header h1").html(texts[$(this).attr("id")]);
	});

	$("header nav a").on("click", function() {
		$("body #content ul li").removeClass("current");
		$("body #content ul li#"+$(this).attr("target")).addClass("current");

		$("header nav a").removeClass("current");
		$(this).addClass("current");

		$("header h1").html(texts[$(this).attr("target")]);
	});
});