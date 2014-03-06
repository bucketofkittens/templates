$(document).ready(function() {

	function proportion() {
		$("body #content > ul > li, body #content > ul").css("height", $(window).height()-330);
		$("body #content > ul").css("width", ($(window).height()-330)*3.3);
	}

	$(window).resize(function() {
		proportion();
	});

	proportion();

	$("body #content ul li").on("click", function() {
		$("body #content ul li").removeClass("current");
		$(this).addClass("current");

		$("header nav a").removeClass("current");
		$("header nav a[target='"+$(this).attr("id")+"']").addClass("current");
	});

	$("header nav a").on("click", function() {
		$("body #content ul li").removeClass("current");
		$("body #content ul li#"+$(this).attr("target")).addClass("current");

		$("header nav a").removeClass("current");
		$(this).addClass("current");
	});
});