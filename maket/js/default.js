$(document).ready(function() {
	$('.services .scroll').jScrollPane( {
        horizontalDragMaxWidth: 98
    });

	if($(".scroll1 .scroll").size() > 0) {
        var scroller1 = $('.scroll1 .scroll').jcarousel({
            wrap: 'circular',
            visible: 3,
            scroll: 1
        });
        $(".scroller .prev").on("click", function() {
            scroller1.jcarousel('scroll', '-=1');
        });
        $(".scroller .next").on("click", function() {
            scroller1.jcarousel('scroll', '+=1');
        });
    }
    if($("#main-facts .scroll2").size() > 0) {
        var scroller2 = $('#main-facts .scroll2').jcarousel({
            wrap: 'circular',
            visible: 3,
            scroll: 1
        }); 
        $("#main-facts .prev").on("click", function() {
            scroller2.jcarousel('scroll', '-=1');
        });
        $("#main-facts .next").on("click", function() {
            scroller2.jcarousel('scroll', '+=1');
        });
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

        $(".datepicker").datepicker({
          showOn: "button",
          buttonImage: "./images/333/calendar.png",
          buttonImageOnly: true,
          changeYear: true
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
});