/**
 * [SVGLoader description]
 * @param {[type]} app [description]
 */
var SVGLoader = function(app, clickCallback) {
	this.CSS = {
		"BG": "#bg-svg",
		"SVG": "#svg"
	}
	this.app = app;
	this.maxOpacity = 0.3;
	this.minOpacity = 0.001;
	this.groupClick = clickCallback;

	this.elements = {
		"BG": $(this.CSS["BG"]),
		"SVG": $(this.CSS["SVG"])
	}

	this.load = function(path, videoPath) {
		this.elements["BG"].html('<object id="svg" type="image/svg+xml" data="'+path+'" width="100%" height="100%" ></object>');
		this.elements["SVG"] = $(this.CSS["SVG"]);
		this.prepareSvg_();
	}

	this.prepareSvg_ = function() {
		this.elements["SVG"].on("load", $.proxy(this.onLoadSvg_, this));
	}

	this.onPathClick_ = function() {

	}

	

	this.onLoadSvg_ = function() {
		var svg = this.elements["SVG"][0].getSVGDocument();
		var self = this;
		
		$.each($(svg).find("path"), function(key, value) {
			$(value).attr("fill", "#ffffff");
			$(value).attr("fill-opacity", "0");
			$(value).css("cursor", "pointer");
		});

		var groups = $(svg).find("g");
		groups.off();

		groups.on("mouseover", function() {
			$(this).stop().find("path").animate({
				"fill-opacity": "0.3"
			}, 100);
		});
		groups.on("mouseout", function() {
			$(this).stop().find("path").animate({
				"fill-opacity": "0.001"
			}, 100);
		});

		groups.on("click", this.groupClick);
	}

}

/**
 * [VideoPlayer description]
 */
var VideoPlayer = function() {
	this.CSS = {
		"BG": "bg-video",
		"VIDEO": "video"
	}
	this.elements = {
		"BG": document.getElementById(this.CSS["BG"]),
		"VIDEO": document.getElementById(this.CSS["VIDEO"])
	}

	this.player = _V_(this.CSS["VIDEO"], {
		techOrder: ["html5", "flash"]
	});
	this.endedCallback = {}

	this.play = function(videoPath, endedCallback) {
		this.endedCallback = endedCallback;
		this.elements["BG"].style.display = "block";
		this.player.addEvent('ended', this.endedCallback);
        this.player.src({ type: "video/mp4", src: videoPath});
        this.player.play();
	}

	this.hide = function() {
		this.elements["BG"].style.display = "none";
        this.player.removeEvent("ended", this.endedCallback);
	}

	this.setPoster = function(src) {
		$('#video_html5_api').attr("poster",src);
	}
}

/**
 * [MiniMapWriter Работает с отображением и логикой мини карты слева]
 */
var MiniMapWriter = function() {
	this.CSS = {
		"CONTAINER": "#miniMap"
	}
	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"])
	}
	this.callback = {}

	this.show = function(imagePath, callback) {
		this.callback = callback;
		this.elements["CONTAINER"].fadeIn();
		this.elements["CONTAINER"].css("backgroundImage", "url('"+imagePath+"')");
		this.elements["CONTAINER"].on("click", this.callback);
	}

	this.hiden = function() {
		var self = this;
		this.elements["CONTAINER"].fadeOut();
		this.elements["CONTAINER"].css("backgroundImage", "none");
		this.elements["CONTAINER"].off("click", this.callback);
	}
}

/**
 * [LoadingState description]
 * @param {[type]} app [description]
 */
var LoadingState = function(app) {
	this.stateCSS = {
		"BG-IMAGE": "#bg-image",
		"NAV-ELEMENTS": ".nav-elements",
		"LOADER": "#load",
		"LOAD-IMAGE": "#load-image"
	}
	this.animateSpeed = 5000;
	this.rotateTick_ = 50;
	this.angle = 0;
	this.rotateEvent_ = {};

	this.elements = {
		"BG-IMAGE": $(this.stateCSS["BG-IMAGE"]),
		"NAV-ELEMENTS": $(this.stateCSS["NAV-ELEMENTS"]),
		"LOADER": $(this.stateCSS["LOADER"]),
		"LOAD-IMAGE": $(this.stateCSS["LOAD-IMAGE"])
	}

	this.run = function() {
		this.elements["BG-IMAGE"].css("backgroundImage", "url('"+ImagesList["PRELOAD"]["IMAGE"]+"')");
		this.elements["LOADER"].show();

		this.rotateEvent_ = setInterval($.proxy(this.rotate_, this), this.rotateTick_);
	}

	this.rotate_ = function() {
		this.angle += 3;
		this.elements["LOAD-IMAGE"].rotate(this.angle);
	}

	this.stop = function(callback) {
		this.elements["NAV-ELEMENTS"].fadeIn(this.animateSpeed, callback);
		this.elements["LOADER"].fadeOut(this.animateSpeed);

		clearInterval(this.rotateEvent_);
	}
}

/**
 * [MapStateZoom1 description]
 * @param {[type]} app [description]
 */
var MapStateZoom1 = function(app) {

	this.stateCSS = {
		"BG-IMAGE": "#bg-image"
	}

	this.stateElements  = {
		"BG-IMAGE": {}
	}

	this.bgImage = new Image;

	this.stateElements["BG-IMAGE"] = $(this.stateCSS["BG-IMAGE"]);

	this.backgroundImageLoaded_ = function() {
		this.stateElements["BG-IMAGE"].css("backgroundImage", "url('"+this.bgImage.src+"')");
		this.app.videoPlayer.hide();
	}

	this.show = function() {
		this.setBgImage();
		this.SVGWriter.load(ImagesList["ZOOM1"]["SVG"]);
	}

	this.clear = function() {

	}

	this.setBgImage = function(bgImageLoaded) {
		this.bgImage = new Image;
    	this.bgImage.onload = $.proxy(this.backgroundImageLoaded_, this);
    	this.bgImage.src = ImagesList["ZOOM1"]["MAP"];
	}

	this.onSvgClick_ = function(evt) {
		var key = $(evt.target).parent().index();
		var videoPath = ImagesList["ZOOM1"]["VIDEO"][key];

		this.app.currentRegion = key;
		this.app.videoPlayer.play(videoPath, $.proxy(this.onVideoPlayStop_, this));
	}

	this.onVideoPlayStop_ = function(e) {
		this.app.zoomStateManager.nextState();
		this.app.zoomStateManager.getStateModel().show();
	}

	this.app = app;
	this.SVGWriter = new SVGLoader(app, $.proxy(this.onSvgClick_, this));
}

/**
 * [MapStateZoom2 description]
 * @param {[type]} app [description]
 */
var MapStateZoom2 = function(app) {
	this.miniMapWriter = new MiniMapWriter();

	this.stateCSS = {
		"BG-IMAGE": "#bg-image"
	}

	this.stateElements =  {
		"BG-IMAGE": {}
	}

	this.bgImage = new Image;

	this.stateElements["BG-IMAGE"] = $(this.stateCSS["BG-IMAGE"]);

	this.show = function() {
		this.setBgImage();
		
		setTimeout($.proxy(this.addMiniMap, this), 0);

		this.SVGWriter.load(ImagesList["ZOOM2"][this.app.currentRegion]["SVG"]);
	}

	this.backgroundImageLoaded_ = function() {
		this.stateElements["BG-IMAGE"].css("backgroundImage", "url('"+this.bgImage.src+"')");
		this.app.videoPlayer.hide();
	}

	this.setBgImage = function(bgImageLoaded) {
		this.bgImage = new Image;
    	this.bgImage.onload = $.proxy(this.backgroundImageLoaded_, this);
    	this.bgImage.src = ImagesList["ZOOM2"][this.app.currentRegion]["MAP"];
	}

	this.addMiniMap = function() {
		this.miniMapWriter.show(ImagesList["ZOOM2"]["BACK"]["IMAGE"], $.proxy(this.onBack, this));
	}

	this.onBack = function() {
		this.miniMapWriter.hiden();
		this.app.videoPlayer.play(ImagesList["ZOOM2"]["BACK"]["VIDEO"], $.proxy(this.onVideoPlayStop, this));
	}

	this.onVideoPlayStop = function() {
		this.app.zoomStateManager.prevState();
		this.app.zoomStateManager.getStateModel().show();
		this.app.currentRegion = "";
		
	}

	this.clear = function() {
		this.miniMapWriter.hiden();
	}

	this.onSvgClick_ = function(evt) {
		var key = $(evt.target).parent().index();
		var videoPath = ImagesList["ZOOM2"]["ITEMS"][key]["VIDEO"];

		this.app.currentRegion = key;
		this.app.videoPlayer.play(videoPath, $.proxy(this.onVideoPlayStop_, this));
	}

	this.onVideoPlayStop_ = function(e) {
		this.app.zoomStateManager.nextState();
		this.app.zoomStateManager.getStateModel().show();
	}

	this.app = app;
	this.SVGWriter = new SVGLoader(app, $.proxy(this.onSvgClick_, this));
}

/**
 * [MapStateZoom3 description]
 * @param {[type]} app [description]
 */
var MapStateZoom3 = function(app) {
	this.app = app;
	this.SVGWriter = new SVGLoader(app, ImagesList["ZOOM2"]["ITEMS"]["VIDEO"]);
	this.miniMapWriter = new MiniMapWriter();
	this.bgImage = new Image;

	this.stateCSS = {
		"BG-IMAGE": "#bg-image"
	}

	this.stateElements = {
		"BG-IMAGE": {}
	}

	this.stateElements["BG-IMAGE"] = $(this.stateCSS["BG-IMAGE"]);

	this.show = function() {
		this.setBgImage();
		
		setTimeout($.proxy(this.addMiniMap, this), 0);

		this.SVGWriter.load(ImagesList["ZOOM3"][this.app.currentRegion]["SVG"]);
	}

	this.backgroundImageLoaded_ = function() {
		this.stateElements["BG-IMAGE"].css("backgroundImage", "url('"+this.bgImage.src+"')");
		this.app.videoPlayer.hide();
	}

	this.setBgImage = function(bgImageLoaded) {
		this.bgImage = new Image;
    	this.bgImage.onload = $.proxy(this.backgroundImageLoaded_, this);
    	this.bgImage.src = ImagesList["ZOOM3"][this.app.currentRegion]["MAP"];
	}

	this.addMiniMap = function() {
		this.miniMapWriter.show(ImagesList["ZOOM3"][this.app.currentRegion]["BACK"]["IMAGE"], $.proxy(this.onBack, this));
	}

	this.onBack = function() {
		this.miniMapWriter.hiden();
		this.app.videoPlayer.play(ImagesList["ZOOM3"][this.app.currentRegion]["BACK"]["VIDEO"], $.proxy(this.onVideoPlayStop, this));
	}

	this.onVideoPlayStop = function() {
		this.app.currentRegion = ImagesList["ZOOM3"][this.app.currentRegion]["BACK"]["LINK"];

		this.app.zoomStateManager.prevState();
		this.app.zoomStateManager.getStateModel().show();
	}

	this.clear = function() {
		this.miniMapWriter.hiden();
	}
}


/**
 * [ZoomStateManager description]
 */
var ZoomStateManager = function(application) {
	this.currentState = 1;
	this.maxState = 3;
	this.stateModel = {};
	this.application = application;
	this.models = [];

	this.prevState = function() {
		this.currentState--;
		this.stateModel.clear();
		return this.currentState;
	}

	this.nextState = function() {
		this.currentState++;
		if(this.currentState > this.maxState) {
			this.currentState = this.maxState;
		} 
		this.stateModel.clear();
		return this.currentState;
	}

	this.getStateModel = function() {
		if(this.currentState == 1) {
			this.stateModel = new MapStateZoom1(this.application);
		}
		if(this.currentState == 2) {
			this.stateModel = new MapStateZoom2(this.application);
		}
		if(this.currentState == 3) {
			this.stateModel = new MapStateZoom3(this.application);
		}
		return this.stateModel;
	}
}



/**
 * [ImagePreloader description]
 * @param {[type]} arrayOfImages [description]
 */
var ImagePreloader = function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

/**
 * @todo Сделать потом через рекурсию! Пока что влом
 * [ImagePreloaderPrepare description]
 * @param {[type]} arr [description]
 */
var ImagePreloaderPrepare = function(arr) {
	var outArr = [];
	ImagePreloaderIteration(arr, outArr);
    return outArr;
}

/**
 * [ImagePreloaderIteration description]
 * @param {[type]} item  [description]
 * @param {[type]} array [description]
 */
var ImagePreloaderIteration = function(item, array) {
	if(typeof(item) == "object") {
		$.each(item, function(key3, value3) {
			ImagePreloaderIteration(value3, array);
		});
	} else {
		var postfixArr = item.split(".");
		var postfix = postfixArr[postfixArr.length-1];
		if(postfix == "png" || postfix == "jpg" || postfix == "gif") {
			array.push(item);	
		}	
	}

	return array;
}

/**
 * [AppTimer description]
 * @param {[type]} app [description]
 */
var AppTimer = function(app) {
	this.timerEvent_ = {};
	this.CSS = {
		"hour": "#hour",
		"minute": "#minute",
		"day": "#day",
		"month": "#month",
		"age": "#age"
	}
	this.month = ['января','февраля','марта','апреля','мая','июня', 'июля','августа','сентября','рктября','ноября','декабря'];
	this.elements = {
		"minute": $(this.CSS["minute"]),
		"hour": $(this.CSS["hour"]),
		"day": $(this.CSS["day"]),
		"month": $(this.CSS["month"]),
		"age": $(this.CSS["age"])
	}

	this.run = function() {
		this.tick_();
		this.timerEvent_ = setInterval($.proxy(this.tick_, this), 10000);
	}

	this.tick_ = function() {
		var date = new Date();

		var strMonth = '' + date.getMinutes();
		if (strMonth.length == 1) {
		  strMonth = '0' + strMonth;
		}

		this.elements["hour"].html(date.getHours());
		this.elements["minute"].html(strMonth);
		this.elements["day"].html(date.getDate());
		this.elements["month"].html(this.month[date.getMonth()]);
		this.elements["age"].html(date.getUTCFullYear());
	}
}

/**
 * [Application description]
 */
var Application = function() {
	this.zoomStateManager = new ZoomStateManager(this);
	this.appSize = [1920, 1080];
	this.currentRegion = "";
	this.apiHost = "http://192.168.0.34:3000";

	this.CSS = {
		"APP": "#app",
		"TITLE": "h1"
	}
	this.elements = {
		"APP": $(this.CSS["APP"]),
		"TITLE": $(this.CSS["TITLE"])
	}
	this.loader = new PxLoader();
	this.resources = ImagePreloaderPrepare(ImagesList);
	this.videoPlayer = new VideoPlayer();
	this.loadingState = new LoadingState(this);
	this.appTimer = new AppTimer(this);
	this.parametrsWidgets = new ParametrsWidgets(this);
	this.regionManager = new RegionManager(this);
	this.regions = this.regionManager.getAll();

	this.run = function() {
		this.loadingState.run();
		this.appTimer.run();
		this.initResource_();
	}

	// загружаем ресурсы
	this.initResource_ = function() {
		var self = this;
		$.each(this.resources, function(key, value) {
			var postfixArr = value.split(".");
			var postfix = postfixArr[postfixArr.length-1];
			if(postfix == "png" || postfix == "jpg") {
				var pxImage = new PxLoaderImage(value); 
				self.loader.add(pxImage);	
			}	
			if(postfix == "mp4") {
				var pxImage = new PxLoaderVideo(value); 
				self.loader.add(pxImage);	
			}	
		});
		this.loader.start();
		this.loader.addCompletionListener($.proxy(this.onResouceLoader, this));
	}

	this.init = function() {
		$(this.elements["APP"]).width(this.appSize[0]).height(this.appSize[1]);
	}

	this.onPanelsShow = function() {
		$(".year").selectbox({
			effect: "fade"
		});
		var stateModel = this.zoomStateManager.getStateModel();
		stateModel.show();
	}

	this.onResouceLoader = function() {
		var self = this;
		setTimeout(function() {
			self.loadingState.stop($.proxy(self.onPanelsShow, self));
		}, 0);
	}

	this.setAppTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.init();
}

$(document).ready(function() {
	var application = new Application();
	application.run();	
})
