
$(document).ready(function() {
	$('.services .scroll').jScrollPane( {
        horizontalDragMaxWidth: 98
    });

	if($(".scroll1 .scroll").size() > 0) {
        var scroller1 = $('.scroll1 .scroll').jcarousel({
            wrap: 'circular',
            visible: 4,
            scroll: 1,
            buttonNextHTML: null,
            buttonPrevHTML: null,
            initCallback: scroll1_initCallback,
            itemFallbackDimension: 75
        });
        function scroll1_initCallback(carousel) {
            $(".scroller .prev").on("click", function() {
                carousel.prev();
            });
            $(".scroller .next").on("click", function() {
                carousel.next();
            });
        };
        
    }
    if($("#main-facts .scroll2").size() > 0) {
        var scroller2 = $('#main-facts .scroll2').jcarousel({
            wrap: 'circular',
            visible: 7,
            scroll: 1,
            buttonNextHTML: null,
            buttonPrevHTML: null,
            initCallback: scroll2_initCallback,
        }); 
        function scroll2_initCallback(carousel2) {
            $("#main-facts .prev").on("click", function() {
                carousel2.prev();
            });
            $("#main-facts .next").on("click", function() {
                carousel2.next();
            });
        };
    }

    $(".vtur .player nav ul li .play").on("click", function() {
        $(this).toggleClass("pause");
    });

    $(".accordeon dt").on("click", function () {
        if(!$(this).hasClass("current")) {
            $(this).parent().find("dt").removeClass("current");
            $(this).parent().find("dd.current").slideUp("slow", function() {
                $(this).removeClass("current");
            })
            $(this).addClass("current");
            $(this).next().slideDown("slow", function() {
                $(this).addClass("current");
            })   
        } else {
            $(this).parent().find("dt").removeClass("current");
            $(this).parent().find("dd.current").slideUp("slow", function() {
                $(this).removeClass("current");
            })    
        }
        
    });

    $(".sub-nav1 li span").on("click", function() {
        if(!$(this).parent().hasClass("current")) {
            $(".sub-nav1 li").removeClass("current");
            $(this).parent().addClass("current");
            $(".hidden-box").slideUp();
            $(".hidden-box."+$(this).parent().attr("rel")).slideDown();
        }
    });

    if(typeof($.datepicker) != "undefined") {
        $.datepicker.regional['ru'] = {
            closeText: 'Закрыть',
            prevText: '&#x3c;Пред',
            nextText: 'След&#x3e;',
            currentText: 'Сегодня',
            monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
            'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
            'Июл','Авг','Сен','Окт','Ноя','Дек'],
            dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
            dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
            dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            weekHeader: 'Нед',
            dateFormat: 'dd.mm.yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''};
        $.datepicker.setDefaults($.datepicker.regional['ru']);

        $(document.body).delegate('select.ui-datepicker-year', 'mousedown', function() {
          (function(sel) {
            var el = $(sel);
            var ops = $(el).children().get();
            if ( ops.length > 0 && $(ops).first().val() < $(ops).last().val() ) {
              $(el).empty();
              $(el).html(ops.reverse());
            }
          })(this);
        });

        $(".datepicker").datepicker({
          showOn: "button",
          buttonImage: "./images/333/calendar.png",
          buttonImageOnly: true,
          changeYear: true,
          yearRange: '-35:+0'
        });    
    }

    if($(".mask1").size() > 0) {
        $(".mask1").mask("99 99 9999 г.");    
    }

    var isIE = /*@cc_on!@*/false;

    if(isIE) {
        $(".about ul.column li.block").on("mouseenter", function() {
            $(this).animate({
                top: "-10px",
                left: "-10px"
            });
        });
        $(".about ul.column li.block").on("mouseleave", function() {
            $(this).animate({
                top: "0px",
                left: "0px"
            });
        });
    }
    
    $("#shadow-popup").height($("#main").height()+$("footer").outerHeight(true));

    $("#info-box2 .phone ul li:first-child a").on("click",function() {
        $("#shadow-popup").fadeIn();
        $("#popup2").fadeIn();
    });
    $("#info-box2 .phone ul li:last-child a").on("click",function() {
        $("#shadow-popup").fadeIn();
        $("#popup1").fadeIn();
    });

    $(".popup .close").on("click", function() {
        $("#shadow-popup").fadeOut();
        $(".popup").fadeOut();
    });

    $(window).scroll(function () {
        if($(".about").size() > 0) {
            if(($(window).innerHeight() + $(window).scrollTop()) >= $("body").height()) {
                $.each($(".content-inner .column"), function(k, v) {
                    var cloned = $(v).clone();
                    $(v).append(cloned.html());
                })
               
            } 
        }
      
    });
});