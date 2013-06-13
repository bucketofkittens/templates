$(function () {
  $("#page header li a").click(function () {
    var elementClick = $(this).attr("href");
    var stp = 104;
    var self = this;
    if(elementClick == "#wwt") {
    	stp = 190;
    }
    if($(window).width() < 450) {
        if(elementClick == "#welcome") {
            stp = 130;
        }
        if(elementClick == "#team") {
            stp = 150;
        } 
        if(elementClick == "#do") {
            stp = 190;
        } 
    }
    var destination = $(elementClick).offset().top - stp;
    $('html,body').animate({ scrollTop: destination }, 500, function() {
        $("#page header li a").removeClass("current");
        $(self).addClass("current");
    });
    if($(window).width() < 450) {
        $("#page header ul").hide(); 
    }
    return false;
  });

  $("#page #content #team .empls li").on("click", function() {
    list_rotate(this, "#page #content #team .empls .elements", "#page #content #team .empls li");
  });

  $("#do .items_list li").on("click", function() {
    list_rotate(this, "#do .body .gallery img", "#do .items_list li");
  });

  $("#do .items_list li").bind('ontouchmove', function(event) {
    list_rotate(this, "#do .body .gallery img", "#do .items_list li");
  });

  $("#page #content #team .empls li").bind('ontouchmove', function(event) {
    list_rotate(this, "#page #content #team .empls .elements", "#page #content #team .empls li");
  });

  function list_rotate(element, elements, listers) {
    if(!$(element).hasClass("current")) {
        var index = $(element).index();
        $(listers+".current").removeClass("current");
        $(element).addClass("current");

        $(elements+".show").css("display", "block").animate({
                opacity: "0"
            },
            "slow",
            function() {
                $(this).css("display", "none");
                $(this).removeClass("show");
                var newVal = $(elements).eq(index);
                newVal.addClass("show").css("display", "block");
                newVal.animate({
                    opacity: 1
                }, function() {
                    $(this).addClass("show");  
                })  
            }
        );
    }
  }

  setInterval(function() {
    var currentIndex = $("#about ul.list_items li.current").index();

    currentIndex += 1;
    if($("#about ul.list_items li").size() == currentIndex) {
        currentIndex = 0;
    }
    $("#about ul.list_items li.current").removeClass("current");
    $("#about ul.list_items li").eq(currentIndex).addClass("current");

    $("#about .items li.show").animate({
                left: -300
            },
            "slow",
            function() {
                $("#about .items li.show").removeClass("show");
                var newVal = $("#about .items li").eq(currentIndex);
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

        $("#about .items li.show").animate({
                left: -300
            },
            "slow",
            function() {
                $("#about .items li.show").removeClass("show");
                var newVal = $("#about .items li").eq(index);
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

  $("#page header a.cu, #page #content #wwt span, #welcome .offices span, #page #content #wwt span").on("click", function(){
    $("#shadow").fadeIn();
    $("#shadow").css("height", $("#page").height()+$("footer").height());
    $(".popup").fadeIn();
    var step = 50;
    if($(window).width() < 450) {
        step = 200;
    }
    $("#popup1").css("top", $(window).scrollTop()+step);
    return false;
  });

  $(".popup .close").on("click", function() {
    $(this).closest(".popup").fadeOut();
    $("#shadow").fadeOut(function() {
        $(".popup h2").html("Contact us");
    });
  });

  $("#do .body span").on("click", function(){
    $(".popup h2").html("Order research");
    $("#shadow").fadeIn();
    $("#shadow").css("height", $("#page").height()+$("footer").height());
    $(".popup").fadeIn();
    var step = 50;
    if($(window).width() < 450) {
        step = 200;
    }
    $("#popup1").css("top", $(window).scrollTop()+step);
  });

  $("#page header .menu").on("click", function() {
    $("#page header ul").toggle();
  });

  $(document).on("click", function() {
    if ($(event.target).closest(".menu").length) return;
    if($(window).width() < 450) {
        $("#page header ul").hide();
    }
  });

    var scrollElements = [];
    $.each($("#page header ul a"), function(key, value) {
        scrollElements.push($($(value).attr("href")));
    });
 
    $(window).scroll(function() {
        var currentTop = $(window).scrollTop();
        $.each(scrollElements, function(key, value) {
            if(currentTop > $(value).position().top-150  && currentTop < $(value).position().top+$(value).outerWidth(true)) {
                $("#page header li a").removeClass("current");
                $("#page header li a[href='#"+$(value).attr("id")+"']").addClass("current");
            }
        });
    });
});