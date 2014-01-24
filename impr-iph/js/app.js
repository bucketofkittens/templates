$(document).ready(function() {
	$(".page").css("min-height", $(window).height());

	$("#iphone_page").scroll(function() {
		alert("scroll");
	})
})