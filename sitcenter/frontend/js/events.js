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

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var OnDistrictChangeState = function(app, mapStateManager, video_id, currentRegion) {
	this.app = app;
	this.mapStateManager = mapStateManager;
	this.finishEvent = 0;
	this.maxEvent = 2;

	this.onAfterEvent_ = function() {
		this.finishEvent += 1;
		this.testEvents_();
	}

	this.testEvents_ = function() {
		if(this.finishEvent == this.maxEvent) {
			this.onAllFinish_();
		}
	}

	this.onAllFinish_ = function() {
		this.finishEvent = 0;

		this.mapStateManager.SVGWriter.show();
		this.app.mapStateManager.show();
		this.app.mapColorel.show();
		this.app.videoPlayer.hide();
	}

	if(this.app.parametrsWidgets.currentParametr != null) {
		this.app.mapColorel.colored(
			this.app.parametrsWidgets.currentParametr.id, 
			this.app.currentRegion, 
			this.app.ageSelectorWidget.selectedYear,
			$.proxy(this.onAfterEvent_, this)
		);
	} else {
		this.finishEvent += 1;
	}

	this.app.videoPlayer.play(
		video_id,
		{
			onEndedCallback: $.proxy(this.onAfterEvent_, this),
			poster: this.mapStateManager.bgImage	
		}
	);

	
}