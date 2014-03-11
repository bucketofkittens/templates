var scrollStep = 0;
var scrollStepItems = 0;

document.ontouchmove = function(e){
	if(e.touches.length == 1) {
		e.preventDefault();	
	}
}

function slide() {
	if(scrollStep < 0) {
		scrollStep = 0;
	}
	if(scrollStep > 4) {
		scrollStep = 4;
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

function scrollItems() {
	if(scrollStepItems < 0) {
		scrollStepItems = 0;
		scrollStep -= 1;
		slide();
	}
	if(scrollStepItems > 4) {
		scrollStepItems = 4;
		scrollStep += 1;
		slide();
	}
	$(".itms").animate({
		top: "-"+(scrollStepItems*200)+"px"
	}, 600);
	$(".imgs").attr("src", "./images/img"+(scrollStepItems+1)+".png");
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

$(document).ready(function() {
	preload([
	    './images/img1.png',
	    './images/img2.png',
	    './images/img3.png',
	    './images/img4.png',
	    './images/img5.png',
	    './images/img6.png'
	]);
	
	$(".page").css("height", $(window).height());


	var element = document.getElementById('content');
	Hammer(element).on("dragend", function(event) {
		if(scrollStep == 2) {
			if(event.gesture.direction == "up") {
				scrollStepItems += 1;
			} else {
				scrollStepItems -= 1;
			}
			scrollItems();
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