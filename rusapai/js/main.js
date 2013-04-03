$(function () {
  $("#page header li a").click(function () {
    var elementClick = $(this).attr("href");
    var stp = 104;
    var self = this;
    if(elementClick == "#wwt") {
    	stp = 190;
    }
    var destination = $(elementClick).offset().top - stp;
    $('html,body').animate({ scrollTop: destination }, 500, function() {
        $("#page header li a").removeClass("current");
        $(self).addClass("current");
    });
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

  setInterval(function() {
    var currentIndex = $("#about ul.list_items li.current").index();

    currentIndex += 1;
    if($("#about ul.list_items li").size() == currentIndex) {
        currentIndex = 0;
    }
    $("#about ul.list_items li.current").removeClass("current");
    $("#about ul.list_items li").eq(currentIndex).addClass("current");

    $("#about .gallery li.show").animate({
                left: -300
            },
            "slow",
            function() {
                $("#about .gallery li.show").removeClass("show");
                var newVal = $("#about .gallery li").eq(currentIndex);
                newVal.css("left", "300px");
                newVal.addClass("show");
                newVal.animate({
                    left: 0
                })
            }
        );
  }, 3000);

  $("#about ul.list_items li").on("click", function() {
    if(!$(this).hasClass("current")) {
        var index = $(this).index();
        $("#about ul.list_items li.current").removeClass("current");
        $(this).addClass("current");

        $("#about .gallery li.show").animate({
                left: -300
            },
            "slow",
            function() {
                $("#about .gallery li.show").removeClass("show");
                var newVal = $("#about .gallery li").eq(index);
                newVal.css("left", "300px");
                newVal.addClass("show");
                newVal.animate({
                    left: 0
                })
            }
        );
    }
  });

  

  $('input[type="checkbox"]').styler();

  $("#page header a.cu").on("click", function(){
    $("#shadow").fadeIn();
    $("#shadow").css("height", $("#page").height()+$("footer").height());
    $(".popup").fadeIn();
  });

  $(".popup .close").on("click", function() {
    $(".popup h2").html("Contact us");
    $(this).closest(".popup").fadeOut();
    $("#shadow").fadeOut();
  });

  $("#do .body span").on("click", function(){
    $(".popup h2").html("Order research");
    $("#shadow").fadeIn();
    $("#shadow").css("height", $("#page").height()+$("footer").height());
    $(".popup").fadeIn();
  });

  $("#page header .menu").on("click", function() {
    $("#page header ul").toggle();
  });
});