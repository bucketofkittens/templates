/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var ParametrsWidgets = function(app) {
	this.app =  app;
	this.CSS = {
		"SHOW": "#paramers-show",
		"MAIN": "#parametrs-widget"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"])
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["SHOW"].on("keydown", $.proxy(this.onShow_, this));
	}

	this.onShow_ = function() {
		this.elements["MAIN"].fadeIn();
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