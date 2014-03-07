$(document).ready(function() {

	function proportion() {
		var step = 300;

		if($(window).width() < 805) {
			step = 630;
		}

		var isiPad = navigator.userAgent.match(/iPad/i) != null;

		if(isiPad) {
			if(orientation == 0 || orientation == 180) {
				step = 630;
			}
			if((orientation == 0 || orientation == 180) && window.devicePixelRatio > 1) {
				step = 810;
			}
		}

		$("body #content > ul > li, body #content > ul").css("height", $(window).height()-step);
		$("body #content > ul").css("width", ($(window).height()-step)*2.9);
	}

	$(window).resize(function() {
		proportion();
	});

	proportion();

	window.addEventListener("orientationchange", proportion, false);

	if(lang == "RUS") {
		var texts = {
			"project": "Холдинг объединяет <br />высокотехнологичные компании, <br />успешно работающие на IT-рынке <br />Российской Федерации",
			"client": "Компании Холдинга заслужили высокую репутацию как надежные поставщики, обладающие глубокой профессиональной экспертизойв сфере системной интеграции, разработки программного обеспеченияна заказ и информатизации целого ряда отраслей.",
			"contact": "Сегодня компании Холдинга представлены в трех крупнейших субъектах Российской Федерации: в Москве, Санкт-Петербурге и Новосибирской области. Представительства компаний группы, партнеры и агенты работают на всей территории Российской Федерации."
		};	
	}

	if(lang == "ENG") {
		var texts = {
			"project": "The Holding unites <br />several hi-tech companies, <br />which are successfully operating <br />in the Russian IT market",
			"client": "The companies of the Holding have recommended themselves in the areas of system integration, custom-made development of software and informatization of a number of branches as the reliable suppliers possessing deep professional expertise.",
			"contact": "Today the Holding is presented in the three largest territories of the Russian Federation: in Moscow, St. Petersburg and Novosibirsk region. Representatives of the companies under the Holding, its partners and agents, work for the most part in the territory of the Russian Federation."
		};	
	}
	

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
	
	$('body').flowtype({
		minimum   : 500,
		maximum   : 1200,
		minFont   : 12,
		maxFont   : 40,
		fontRatio : 30
	});
});