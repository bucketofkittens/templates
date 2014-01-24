var scrollStep = 0;

$(document).ready(function() {
	$(".page").css("min-height", $(window).height());

	$(document).bind('swipemove',function() {
		console.log("swipe");
	});
	/*
	$(document).scroll(function() {
		scrollStep += 1;
		$("html body").animate({ scrollTop: $(window).height()*scrollStep }, 600);
	})*/
})