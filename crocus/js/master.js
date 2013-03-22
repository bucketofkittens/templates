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
    			console.log(self.currentElement);
    			self.setNavCurrentElement(self.currentElement);
    			self.showElement(self.currentElement);
    		});
    	}

    	this.init_();
    }

    function ScalledGallery(elementName) {
        this.elementName = elementName;
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
            $(this.itemName, this.element).removeClass("center_img").removeClass("left_img").removeClass("right_img");
            $(this.itemName, this.element).eq(index).addClass("center_img");
            $(this.itemName, this.element).eq(index-1).addClass("left_img");

            var rightIndex = index+1;
            if(rightIndex >= this.elementCount) {
                rightIndex = 0;
            }
            $(this.itemName, this.element).eq(rightIndex).addClass("right_img");
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
                console.log(self.currentElement);
                self.setNavCurrentElement(self.currentElement);
                self.showElement(self.currentElement);
            });
        }

        this.init_();
    }

    var cameraScroller = new CameraScroller(".banner");
    var scalledGallery = new ScalledGallery(".scaled_gallery");

    $.each($(".second-menu"), function(k, v) {
    	$(v).css("left", "-"+parseInt($(v).parents("li").position().left+20)+"px");
    });
    

    $(".tabs .titles li span").on("click", function() {
        if(!$(this).hasClass("current")) {
            var currentIndex = $(this).parent().index();
            var items = $(this).parents(".tabs").find(".items");

            $(this).parents(".titles").find("li span").removeClass("current");
            $(this).addClass("current");
            items.hide();
            items.eq(currentIndex).slideDown();    
        }
    });

    if($(".jcarousel > div").size() > 0) {
        $(".jcarousel > div").jcarousel({
            wrap: 'circular'
        });
        $(".jcarousel .left").on("click", function() {
            $(".jcarousel > div").jcarousel('scroll', '-=1');
        });
        $(".jcarousel .right").on("click", function() {
            $(".jcarousel > div").jcarousel('scroll', '+=1');
        });
    }

    $("#spec .states i").on("click", function() {
        $(this).parents("dt").next().slideToggle();
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
});