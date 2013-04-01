$(function () {
  $("#page header a").click(function () {
    var elementClick = $(this).attr("href");
    var stp = 104;
    if(elementClick == "#wwt") {
    	stp = 190;
    }
    var destination = $(elementClick).offset().top - stp;
    $('html,body').animate({ scrollTop: destination }, 500);
    return false;
  });

  $("#page #content #team .empls li").on("click", function() {
    if(!$(this).hasClass("current")) {
        var index = $(this).index();
        $("#page #content #team .empls li.current").removeClass("current");
        $(this).addClass("current");

        $("#page #content #team .empls .elements.show").animate({
                left: -500
            },
            "slow",
            function() {
                $("#page #content #team .empls .elements.show").removeClass("show");
                var newVal = $("#page #content #team .empls .elements").eq(index);
                newVal.css("left", "500px");
                newVal.addClass("show");
                newVal.animate({
                    left: 0
                })
            }
        );
    }
  });

  $("#do .items_list li").on("click", function() {
    if(!$(this).hasClass("current")) {
        var index = $(this).index();
        $("#do .items_list li.current").removeClass("current");
        $(this).addClass("current");

        $("#do .body .gallery img.show").animate({
                left: -300
            },
            "slow",
            function() {
                $("#do .body .gallery img.show").removeClass("show");
                var newVal = $("#do .body .gallery img").eq(index);
                newVal.css("left", "300px");
                newVal.addClass("show");
                newVal.animate({
                    left: 0
                })
            }
        );
    }
  });
});