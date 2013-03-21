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
    		$(this.itemName).hide();
    		$(this.itemName).eq(index).fadeIn();
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

    $.each($(".second-menu"), function(k, v) {
    	$(v).css("left", "-"+parseInt($(v).parents("li").position().left+20)+"px");
    });
    
});