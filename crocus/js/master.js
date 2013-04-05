$(document).ready(function() {
	$('.scroll-pane').jScrollPane({
		horizontalDragMaxWidth: 89
	});

	if (window.PIE) {
        $('#page #content .banner p, #page #content .banner ul li, #top-header-bg, #search').each(function() {
            PIE.attach(this);
        });
    }


    function CameraScroller(elementName) {
    	this.elementName = elementName;
    	this.element = $(this.elementName);
    	this.itemName = ".element";
    	this.navElement = $("> ul", this.element);
    	this.elementCount = $(this.itemName, this.element).size();
    	this.currentElement = 0;
    	this.currentName = "current";
    	this.prevElement = $(".left", this.element);
    	this.nextElement = $(".right", this.element);
    	

    	this.init_ = function() {
    		this.drawNavItems_();
    		this.showElement(this.currentElement);
    		this.setNavCurrentElement(this.currentElement);
    		this.bindEvent_();
    	}

    	this.showElement = function(index) {
    		$(this.itemName, this.element).hide();
    		$(this.itemName, this.element).eq(index).fadeIn();
    	}

    	this.drawNavItems_ = function(index) {
    		var i = 0;
    		
    		if(this.elementCount > 1) {
    			for(i = 0; i < this.elementCount; i++) {
    				this.navElement.append('<li></li>');
    			}	
    		}
    	}

    	this.setNavCurrentElement = function(index) {
    		this.navElement.find("li").removeClass(this.currentName);
    		this.navElement.find("li").eq(index).addClass(this.currentName);
    	}

    	this.bindEvent_ = function() {
    		var self = this;
    		$("body").on("click", this.elementName+" > ul li", function() {
    			self.currentElement = $(this).index();
    			self.setNavCurrentElement(self.currentElement);
    			self.showElement(self.currentElement);
    		});

    		$(this.prevElement).on("click", function() {
    			self.currentElement -= 1;
    			if(self.currentElement < 0) {
    				self.currentElement = self.elementCount-1;
    			}
    			self.setNavCurrentElement(self.currentElement);
    			self.showElement(self.currentElement);
    		});

    		$(this.nextElement).on("click", function() {
    			self.currentElement += 1;
    			if(self.currentElement == self.elementCount) {
    				self.currentElement = 0;
    			}
    			self.setNavCurrentElement(self.currentElement);
    			self.showElement(self.currentElement);
    		});
    	}

    	this.init_();
    }

    function ScalledGallery(elementName, params) {
        this.elementName = elementName;
        this.params = params;
        this.element = $(this.elementName);
        this.itemName = "img";
        this.navElement = $("> ul", this.element);
        this.elementCount = $(this.itemName, this.element).size();
        this.currentElement = 0;
        this.currentName = "current";
        this.prevElement = $(".left", this.element);
        this.nextElement = $(".right", this.element);
        

        this.init_ = function() {
            this.drawNavItems_();
            this.showElement(this.currentElement);
            this.setNavCurrentElement(this.currentElement);
            this.bindEvent_();
        }

        this.showElement = function(index) {
            var rightIndex = index+1;
            if(rightIndex >= this.elementCount) {
                rightIndex = 0;
            }

            var center_img = $(this.itemName, this.element).eq(index);
            var left_img = $(this.itemName, this.element).eq(index-1);
            var right_img = $(this.itemName, this.element).eq(rightIndex);
            var old_left_img = $(this.itemName+".left_img", this.element);
            var old_right_img = $(this.itemName+".right_img", this.element);
            var old_center_img = $(this.itemName+".center_img", this.element);

            old_center_img.removeClass("center_img");
            old_right_img.removeClass("right_img");
            old_left_img.removeClass("left_img");

            center_img.show().css("z-index", "20");
            center_img.animate({
                opacity: 1,
                width: this.params.maxImageX,
                height: this.params.maxImageY,
                left: "auto",
                right: this.params.maxImageLeft,
                top: this.params.maxImageTop
            }, 700, function() {
                $(this).addClass("center_img");
            });

            right_img.show().css("z-index", "10");
            right_img.animate({
                opacity: 1,
                width: this.params.minImageX,
                height: this.params.minImageY,
                top: this.params.minImageTop,
                right: this.params.minImageLeft,
                left: "auto"
            }, 700, function() {
                $(this).addClass("right_img");
            });

            left_img.show().css("z-index", "10");
            left_img.animate({
                opacity: 1,
                width: this.params.minImageX,
                height: this.params.minImageY,
                top: this.params.minImageTop,
                right: this.element.width()-this.params.minImageX-this.params.minImageLeft,
                left: "auto",
                "zIndex": 10
            }, 700, function() {
                $(this).addClass("left_img");
            });

        }

        this.drawNavItems_ = function(index) {
            var i = 0;
            
            if(this.elementCount > 1) {
                for(i = 0; i < this.elementCount; i++) {
                    this.navElement.append('<li></li>');
                }   
            }
        }

        this.setNavCurrentElement = function(index) {
            this.navElement.find("li").removeClass(this.currentName);
            this.navElement.find("li").eq(index).addClass(this.currentName);
        }

        this.bindEvent_ = function() {
            var self = this;
            $("body").on("click", this.elementName+" > ul li", function() {
                if($(self.itemName+":animated", self.element).size() == 0) {
                    self.currentElement = $(this).index();
                    self.setNavCurrentElement(self.currentElement);
                    self.showElement(self.currentElement);
                }
            });

            $(this.prevElement).on("click", function() {
                if($(self.itemName+":animated", self.element).size() == 0) {
                        self.currentElement -= 1;
                    if(self.currentElement < 0) {
                        self.currentElement = self.elementCount-1;
                    }
                    self.setNavCurrentElement(self.currentElement);
                    self.showElement(self.currentElement);    
                } 
            });

            $(this.nextElement).on("click", function() {
                if($(self.itemName+":animated", self.element).size() == 0) {
                    self.currentElement += 1;
                    if(self.currentElement == self.elementCount) {
                        self.currentElement = 0;
                    }
                    self.setNavCurrentElement(self.currentElement);
                    self.showElement(self.currentElement);
                }
            });
        }

        this.init_();
    }

    var cameraScroller = new CameraScroller(".banner");
    var scalledGallery = new ScalledGallery("#scaled1", {
        "minImageX": "615",
        "minImageY": "410",
        "minImageLeft": "0",
        "minImageTop": "65",
        "maxImageX": "750",
        "maxImageY": "500",
        "maxImageTop": "20",
        "maxImageLeft": "125"
    });
    var scalledGallery2 = new ScalledGallery("#scaled2", {
        "minImageX": "520",
        "minImageY": "350",
        "minImageLeft": "40",
        "minImageTop": "45",
        "maxImageX": "550",
        "maxImageY": "450",
        "maxImageTop": "-10",
        "maxImageLeft": "225"
    });
    

    $(".tabs .titles li").on("click", function() {
        if(!$(this).hasClass("current")) {
            var currentIndex = $(this).parent().index();
            var items = $(this).parents(".tabs").find(".items");

            $(this).parents(".titles").find("li").removeClass("current");
            $(this).addClass("current");
            items.slideUp(1000, function() {
                items.eq(currentIndex).slideDown(1000);
            });
        }
    });

    if($(".jcarousel > div").size() > 0) {
        $(".jcarousel > div").jcarousel({
            wrap: 'circular',
            size: 3
        });
        $(".jcarousel .left").on("click", function() {
            $(".jcarousel > div").jcarousel('scroll', '-=1');
        });
        $(".jcarousel .right").on("click", function() {
            $(".jcarousel > div").jcarousel('scroll', '+=1');
        });
    }

    $("#spec .states i").on("click", function() {
        var nextDd = $(this).parents("dt").next();
        var currentDt = $(this).parents("dt");
        $("#spec dd").not(nextDd).slideUp();
        $("#spec dt").not(currentDt).find(".states i").removeClass("show");
        $("#spec dt").not(currentDt).find(".states i:first-child").addClass("show");
        nextDd.slideToggle();
        $(this).parent().find("i").removeClass("show");
        if($(this).index()+1 >= $(this).parent().find("i").size()) {
            $(this).parent().find("i").eq(0).addClass("show");
        } else {
            $(this).parent().find("i").eq($(this).index()+1).addClass("show");    
        }
    });

    var maxHeight = 0;
    $.each($(".news-list ul li"), function(k, v) {
        if($(v).height() > maxHeight) {
            maxHeight = $(v).height();
        }
    });

    $(".news-list ul li").css("min-height", maxHeight);

    $(".innerblock.toggle .topic a").on("click", function() {
        var allBlock = $(".innerblock.toggle");
        var currentBlock = $(this).closest(".innerblock");
        var notCurrentBlock = allBlock.not(currentBlock);
        if(!currentBlock.hasClass("all")) {
            notCurrentBlock.animate({
            opacity: 0,
            }, function() {
                notCurrentBlock.hide();
                currentBlock.animate({
                    width: "760px"
                }, function() {
                    $(this).addClass("all");
                });
            });    
        } else {
            currentBlock.animate({
                width: currentBlock.attr("data-width")
            }, function() {
                $(this).removeClass("all");
                notCurrentBlock.show();
                notCurrentBlock.animate({
                    opacity: 1
                })
            });
        }
        
        return false;
    });

    $(window).scroll(function () {
        if($(".news-list").size() > 0) {
            if($(window).scrollTop() + $(window).height() >= $(document).height()-460) {
                var cloned = $(".news-list ul").clone();
                $(".news-list ul").append(cloned.html());
            } 
        }
    });

    $("#page.primary #content #botnav .lr.l2, #page.primary #content #botnav .lr.r").on("click", function() {
        var index = $("#page.primary #content #botnav ul li ul.news li.show").index();
        var newIndex = index + 1;
        var sign = "";
        var size = $("#page.primary #content #botnav ul li ul.news li").size();
        if($(this).hasClass("l2")) {
            newIndex = index - 1;
        }
        if(newIndex >= size) {
            newIndex = 0;
        }

        $("#page.primary #content #botnav ul li ul.news li.show").animate({
                left: "-"+500
            },
            "slow",
            function() {
                $("#page.primary #content #botnav ul li ul.news li.show").removeClass("show");
                var newVal = $("#page.primary #content #botnav ul li ul.news li").eq(newIndex);
                newVal.css("left", "500px");
                newVal.addClass("show");
                newVal.animate({
                    left: 0
                })
            }
        );
      });

    $("#page.primary #content #botnav .lr.l, #page.primary #content #botnav .lr.r2").on("click", function() {
        var index = $("#page.primary #content #botnav ul li ul.news2 li.show").index();
        var newIndex = index + 1;
        var sign = "";
        var size = $("#page.primary #content #botnav ul li ul.news2 li").size();
        if($(this).hasClass("l2")) {
            newIndex = index - 1;
        }
        if(newIndex >= size) {
            newIndex = 0;
        }

        $("#page.primary #content #botnav ul li ul.news2 li.show").animate({
                left: "-"+500
            },
            "slow",
            function() {
                $("#page.primary #content #botnav ul li ul.news2 li.show").removeClass("show");
                var newVal = $("#page.primary #content #botnav ul li ul.news2 li").eq(newIndex);
                newVal.css("left", "500px");
                newVal.addClass("show");
                newVal.animate({
                    left: 0
                })
            }
        );
      });
});