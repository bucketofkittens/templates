$(document).ready(function() {
	$(".page").css("min-height", $(window).height());

	$(window).resize(function() {
		$(".page").css("min-height", $(window).height());
	});

	$('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	  });

	var $sw = $('#content');

    $sw.on('swipedown', function (event) {
       event.preventDefault();
       alert("sw"); 
    });

    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    if(isiPad) {
    	$(".iphone_app").hide();
    }
})