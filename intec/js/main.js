$(document).ready(function() {

	function proportion() {
		$("body #content ul li, body #content ul").css("height", $(window).height()-250);
		$("body #content ul").css("width", ($(window).height()-250)*2.5);
	}

	$(window).resize(function() {
		proportion();
	});

	proportion();
});