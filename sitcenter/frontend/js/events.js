/**
 * [OnGraphUpdateEvent description]
 * @param {[type]} app [description]
 */
var OnGraphUpdateEvent = function(app) {
	this.app = app;

	this.onGraphDataRequest_ = function(data) {
		console.log(data);
		$(this.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
		this.app.graphWidget.updateContent(data);
	}
	
	this.app.graphManager.getGraph(
			this.app.graphRegionsSelectorWidget.getCurrentIds(),
			this.app.graphParamsSelector.getCurrentIds(),
			this.app.graphWidget.getBeginData(),
			this.app.graphWidget.getEndData(),
			$.proxy(this.onGraphDataRequest_, this)
	);
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var OnDistrictUpdateMapEvent = function(app) {
	this.app = app;

	this.app.paramsManager.getParamsByRegionAndYeage(
		this.app.currentRegion, 
		this.app.ageSelectorWidget.selectedYear, 
		$.proxy(this.app.parametrsWidgets.getParametrs_, this.app.parametrsWidgets)
	);
	if(this.app.parametrsWidgets.currentParametr) {
		this.app.mapColorel.colored(
			this.app.parametrsWidgets.currentParametr.id, 
			this.app.currentRegion, 
			this.app.ageSelectorWidget.selectedYear
		);
		this.app.mapColorWidget.updateParams();
		this.app.legendManager.getLegendByParamAndSubject(
			this.app.parametrsWidgets.currentParametr.id, 
			this.app.currentRegion
		);
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var OnFormatUpdateContentEvent = function(app) {
	this.app = app;
	this.app.formatWidget.updateContent();
}