var scrollStep = 0;

function slide() {
	if(scrollStep < 0) {
		scrollStep = 0;
	}
	$("#content").animate({
		top: "-"+(scrollStep*$(window).height())+"px"
	}, 600);
}

function slideIphone() {
	if(scrollStep < 0) {
		scrollStep = 0;
	}
	$("#content").animate({
		top: "-"+(scrollStep*$(window).height())+"px"
	}, 600);
}

$(document).ready(function() {
	$(".page").css("height", $(window).height());


	var element = document.getElementById('content');
	Hammer(element).on("dragend", function(event) {
		if(scrollStep == 2) {

		} else {
			if(event.gesture.direction == "up") {
				scrollStep += 1;
			} else {
				scrollStep -= 1;
			}
	    	//scrollStep += 1;
	        slide();	
		}
		
    });
});