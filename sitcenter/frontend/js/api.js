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
	this.legendWidget = new LegendWidget(this.app);

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
	}

	this.onHidden_ = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed,
			$.proxy(this.onMainHiddened_, this) 
		);
		this.elements["SHOW"].animate({
				right: "0px"
			},
			this.animateSpeed 
		);
		this.legendWidget.hide();
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
		this.elements["MAIN"].animate({
				right: "0px"
			},
			this.animateSpeed,
			$.proxy(this.onMainShowed_, this) 
		);

		this.elements["SHOW"].animate({
				right: this.animateStep
			},
			this.animateSpeed 
		);

		this.legendWidget.show();
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
 * [LegendWidget description]
 * @param {[type]} app [description]
 */
var LegendWidget = function(app) {
	this.app =  app;
	this.animateStep = "-400px";
	this.animateSpeed = 1000;

	this.CSS = {
		"MAIN": "#legend-widget"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}

	this.show = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});
		this.elements["MAIN"].animate( {
				right: "0px"
			},
			this.animateSpeed
		);
	}

	this.hide = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed 
		);
	}
}

/**
 * [RegionManager description]
 * @param {[type]} app [description]
 */
var RegionManager = function(app) {
	this.app = app;
	this.ajaxPath = "/subjects.json";

	this.getByParent = function(id_parent, callback) {
		$.get(this.app.apiHost + "/subjects/"+id_parent+"/children.json", callback);
	}

	this.getParents = function(id_parent, callback) {
		$.get(this.app.apiHost + "/subjects/"+id_parent+"/parent.json", callback);
	}

	this.getById = function(id, callback) {
		$.get(this.app.apiHost + "/subjects/"+id+".json", callback);
	}

	this.getDistricts = function(callback) {
		$.get(this.app.apiHost + "/districts.json", callback);
	}
}