var MenuAnimateSelector = function(menuContainerName, selectorName, itemName) {
    this.menuContainerName = menuContainerName;
    this.selectorName = selectorName;
    this.itemName = itemName;

    this.menuContainerElement = $(this.menuContainerName);
    this.selectorElement = $(this.selectorName, this.menuContainerElement);
    this.itemsElement = $(this.itemName, this.menuContainerElement);

    this.init_ = function() {
        this.selectorElement.css("left", "-100px");
        var current = this.itemsElement.filter(".current");

        if(current.size() > 0) {
            this.moveToElement_({}, current[0], true);
        }
    }

    this.bindEvents_ = function() {
        this.itemsElement.on("mouseenter", $.proxy(this.moveToElement_, this));
        this.itemsElement.parent().on("mouseleave", $.proxy(this.moveToBack_, this)); 
    }

    this.moveToElement_ = function(evt, elementSend, fast) {
        var duration = 500;
        if(typeof(fast) != "undefined") {
            duration = 0;
        }
        if(typeof(elementSend) != "undefined") {
            var element = $(elementSend);
            
        } else {
            var element = $(evt.target).parent();
        }
        
        if((!element.hasClass("current") && typeof(evt) != "undefined")
            || (element.hasClass("current") && typeof(elementSend) != "undefined")) {
            var leftPosition = element.position().left;
            var self = this;
            var animateParam = {
                left: leftPosition+"px",
                width: element.outerWidth()
            };
            if(element.index() == 0) {
                $(self.selectorElement).addClass("border");
            } else {
                $(self.selectorElement).removeClass("border");
            }
            self.itemsElement.removeClass("current").removeClass("white");
            $(self.selectorElement).stop().animate(
                animateParam,
                { 
                    queue: false, 
                    duration: duration,
                    step: function( now, fx ) {
                        if(fx.prop == "width"){
                            if(fx.pos >= 0.6) {
                                element.addClass("current").addClass("white");
                            } else {
                                self.itemsElement.removeClass("current").removeClass("white");
                            }
                        }
                    }
                }
            );
        }
    }

    this.moveToBack_ = function(evt) {
        var elm = this.itemsElement.filter(".begin");
        if(elm.size() > 0 && !elm.hasClass("current")) {
            this.moveToElement_({}, $(this.itemsElement.filter(".begin")[0]));
        } 
    }

    this.init_();
    this.bindEvents_();
}


$(document).ready(function() {

	var isIE = /*@cc_on!@*/false;

	if (isIE) {
		$('.two-cell .left section').columnize({ columns: 2 });
	}
	if (window.PIE) {
        $('.infos1 li').each(function() {
            PIE.attach(this);
        });
		$('.banner1').each(function() {
            PIE.attach(this);
        });
        $('#center > section.content ol span').each(function() {
            PIE.attach(this);
        });
        $('.blue-button').each(function() {
            PIE.attach(this);
        });
        $('.top-nav ul li.current').each(function() {
            PIE.attach(this);
        });
        $('#center > section.content .pagination').each(function() {
            PIE.attach(this);
        });
        $('.back').each(function() {
            PIE.attach(this);
        });
        $('.top-nav .select').each(function() {
            PIE.attach(this);
        });
        $('.footer-nav .select').each(function() {
            PIE.attach(this);
        });
    }

    if($(".scroll").size() > 0) {
        $(".scroll").scrollable();
        var scrollable = $(".scroll").data("scrollable");
        var size = 7;

        scrollable.onSeek(function(event, index) {
            if (this.getIndex() >= this.getSize() - size) {
                $("span.next").addClass("disabled");
            }
        });
        scrollable.onBeforeSeek(function(event, index) {
            if (this.getIndex() >= this.getSize() - size) {
                if (index > this.getIndex()) {
                    return false;
                }
            }
        });    
    }

    if($(".basic-combo").size() > 0) {
        $("select").uniform();
    }
    $('textarea').autosize();

    $("#center section.content .newstime li > a").on("click", function() {
        $("#center section.content .newstime li ul").slideUp("slow");
        $(this).parent().find("ul").slideDown("slow");
        $("#center section.content .newstime li").removeClass('currents');
        $(this).parent().addClass('currents');
    });

    $.each($(".service-list-inner ul li").find("ul"), function() {
        $(this).css("left", "-"+$(this).parent().position().left+"px");
    });

    $(".service-list-inner ul li > a").on("click", function() {
        var parentElement = $(this).parent();

        $(".service-list-inner > ul > li").find(".triangle").css("visibility", "visible");

        if(!parentElement.hasClass("current")) {
            if($(".service-list-inner ul li.current").size() > 0) {
                $(".service-list-inner > ul > li").find(".triangle").css("visibility", "hidden");
                $(".service-list-inner ul li.current").find("ul").slideUp("slow", function() {
                    $(".service-list-inner > ul > li").addClass("gray").removeClass("current");
                    $(".service-list-inner ul li").find(".triangle").hide();
                    showCurrentElement(parentElement);
                });
            } else {
                $(".service-list-inner > ul > li").addClass("gray");
                showCurrentElement(parentElement);  
            }
        } else {
            parentElement.find(".triangle").css("visibility", "hidden");
            parentElement.find("ul").slideUp("normal", function() {
                parentElement.find(".triangle").hide();
            });
            $(".service-list-inner > ul > li").removeClass("gray").removeClass("current");
        }
    });

    function showCurrentElement(el) {
        el.addClass("current").removeClass("gray");
        el.find(".triangle").show().css("visibility", "visible");
        el.find("ul").slideDown(); 
    }

    if($(".banner1").size() > 0) {
        $(".banner1").camera({
            pagination: true,
            navigation: false,
            playPause: false,
            height: "312px",
            fx: "blindCurtainBottomLeft",
            loader: "none"
        }); 
    }
});

$(window).bind("load", function() {
    var menuAnimateSelectorHeader = new MenuAnimateSelector(".top-nav", ".select", "li");
    var menuAnimateSelectorFooter = new MenuAnimateSelector(".footer-nav", ".select", "li");
});