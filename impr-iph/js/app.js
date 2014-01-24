var scrollStep = 0;

$(document).ready(function() {
	$(".page").css("min-height", $(window).height());

	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
		alert(e);
	}, true);
	/*
	$(document).scroll(function() {
		scrollStep += 1;
		$("html body").animate({ scrollTop: $(window).height()*scrollStep }, 600);
	})*/
})