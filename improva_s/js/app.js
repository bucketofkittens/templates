if(navigator.userAgent.match(/iPhone/i)) {
	window.location = window.location+"iphone/";
}

var scrollStep = 0;
var scrollStepItems = 0;
var touchStartEvent;

document.ontouchmove = function(e){
	if(e.touches.length == 1) {
		e.preventDefault();	
	}
}

function scrollFix_() {
	if($("body").scrollTop() > $("#main").height()) {
		$("header.while").addClass("show");
	} else {
		$("header.while").removeClass("show");
	}
}


function scr() {
	scrollStep = 0;
	scroll();
}

function scroll() {
	if(scrollStep < 0) {
		scrollStep = 0;
	}
	if(scrollStep > 2) {
		scrollStep = 2;
	}
	if(scrollStep > 1) {
		$("header.while").addClass("show");
	} else {
		$("header.while").removeClass("show");
	}
	$("#content").animate({
		top: "-"+(scrollStep*$(window).height())+"px"
	}, 600);
}

function scrollItems() {
	if(scrollStepItems < 0) {
		scrollStepItems = 0;
		scrollStep -= 1;
		scroll();
	}
	if(scrollStepItems > 5) {
		scrollStepItems = 5;
		scrollStep += 1;
		scroll();
	}
	$(".itms").animate({
		top: "-"+(scrollStepItems*200)+"px"
	}, 600);
	
	$(".imgs").attr("src", "./images/img"+(scrollStepItems+1)+".png");
	$(".imag").attr("src", "./images/img"+(scrollStepItems+11)+".png");
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
	    './images/img6.png',
	    './images/img11.png',
	    './images/img12.png',
	    './images/img13.png',
	    './images/img14.png',
	    './images/img15.png',
	    './images/img16.png'
	]);

	$(".page").css("min-height", $(window).height()-100);

	$(window).resize(function() {
		$(".page").css("min-height", $(window).height()-100);
	});

	$(document).bind('mousewheel', function(e){
		clearTimeout($.data(this, 'timer'));
		$.data(this, 'timer', setTimeout(function() {
			if(scrollStep == 1) {
				if(e.deltaY < 0) {
			    	scrollStepItems += 1;
			    } else {
			    	scrollStepItems -= 1;
			    }
			    scrollItems();
			} else {
				if(e.deltaY < 0) {
			    	scrollStep += 1;
			    } else {
			    	scrollStep -= 1;
			    }
			    scroll();
			}
		}, 250));
	 });

	$('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      var name = this.hash.slice(1);
	      if(name == "about") {
	      	scrollStep = 1;
	      }
	      if(name == "contact") {
	      	scrollStep = 2;
	      }
	      scroll();
	      return false;
	    }
	  });

	var element = document.getElementById('content');
	Hammer(element).on("dragend", function(event) {
		if(scrollStep == 1) {
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
	    	setTimeout(function() {
	    		scroll();	
	    	}, 0);
		}
    });



    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    if(isiPad) {
    	$(".iphone_app").hide();
    }

	$('#socials').share({
        networks: ['facebook','googleplus','twitter']
    });



})

$(window).load(function() {
	scrollFix_();
});