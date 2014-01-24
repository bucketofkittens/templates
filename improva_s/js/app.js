if(navigator.userAgent.match(/iPhone/i)) {
	window.location = window.location+"iphone/";
}

var scrollStep = 0;

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

$(document).ready(function() {
	$(".page").css("min-height", $(window).height()-100);

	$(window).resize(function() {
		$(".page").css("min-height", $(window).height()-100);
	});

	$(document).bind('mousewheel', function(e){
	    if(e.deltaY < 0) {
	    	scrollStep += 1;
	    } else {
	    	scrollStep -= 1;
	    }
	    scroll();
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
		if(event.gesture.direction == "up") {
			scrollStep += 1;
		} else {
			scrollStep -= 1;
		}
    	//scrollStep += 1;
    	setTimeout(function() {
    		scroll();	
    	}, 0)
        	
		
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