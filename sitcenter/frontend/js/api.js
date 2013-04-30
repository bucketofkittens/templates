/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var ParametrsWidgets = function(app) {
	this.app =  app;
	this.CSS = {
		"SHOW": "#paramers-show",
		"MAIN": "#parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": ".hidden"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"])
	}

	this.animateStep = "-400px";
	this.animateSpeed = 1000;

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		//this.elements["SHOW"].on("keydown", $.proxy(this.onShow_, this));
	}

	this.onHidden_ = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed,
			$.proxy(this.onMainHiddened_, this) 
		);;
		return false;
	}

	this.onShow_ = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});
		this.elements["SCROLL"].jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60
			}
		);
		this.elements["MAIN"].animate( {
				right: "0px"
			},
			this.animateSpeed,
			$.proxy(this.onMainShowed_, this) 
		);
		return false;
	}

	this.onMainShowed_ = function() {
		this.elements["SCROLL"].jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60
			}
		);
	}

	this.onMainHiddened_ = function() {
		
	}

	this.bindEvents_();
}

/**
 * [RegionManager description]
 * @param {[type]} app [description]
 */
var RegionManager = function(app) {
	this.app = app;
	this.ajaxPath = "/subjects/";

	this.getAll = function() {
		$.get(this.app.apiHost + this.ajaxPath, function(data) {
		  console.log(data);
		});
	}
}