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
		this.elements["BG"].hide();
		this.elements["BG"].html('<object id="svg" type="image/svg+xml" data="'+path+'" width="100%" height="100%" ></object>');
		this.elements["SVG"] = $(this.CSS["SVG"]);
		this.prepareSvg_();
	}

	this.hide = function() {
		this.elements["BG"].addClass("onHidden");
	}

	this.show = function() {
		this.elements["BG"].removeClass("onHidden");
	}

	this.prepareSvg_ = function() {
		this.elements["SVG"].on("load", $.proxy(this.onLoadSvg_, this));
		this.elements["BG"].show();
	}

	this.onPathClick_ = function() {

	}

	this.appendCSS_ = function(svg) {
		var styleElement = svg.createElementNS("http://www.w3.org/2000/svg", "style");
		styleElement.textContent = '@font-face { font-family: "NeoSansPro-Bold"; src: url("/static/fonts/NeoSansPro-Bold.ttf"); } path { -webkit-transition: all 0.3s linear; } text { -webkit-transition: all 1.3s linear; font-family: "NeoSansPro-Bold", Times, serif; font-weight: bold; font-size: 18px; } .zoom2 { font-size: 32px; } .zoom3 { font-size: 25px;}';
		$(svg).find("svg")[0].appendChild(styleElement);
	}

	this.onLoadSvg_ = function() {
		var svg = this.elements["SVG"][0].getSVGDocument();
		var self = this;

		this.appendCSS_(svg);
		
		$.each($(svg).find("path"), function(key, value) {
			$(value).attr("fill", "#ffffff");
			$(value).attr("fill-opacity", "0");
			$(value).removeAttr("opacity");
			if(self.app.currentZoom != 3) {
				$(value).css("cursor", "pointer");	
			}
		});

		var groups = $(svg).find("g");
		groups.off();

		groups.on("mouseover", function() {
			var paths = $(this).find("path");
			paths.attr({
				"fill-opacity": self.maxOpacity
			});
		});
		groups.on("mouseout", function() {
			var paths = $(this).stop().find("path");
			paths.attr({
				"fill-opacity": self.minOpacity
			});
		});

		groups.on("click", this.groupClick);
	}

	this.drawParamValues = function(data) {
		this.removeParamValues();

		var svg = this.elements["SVG"][0].getSVGDocument();
		var self = this;
		
		$.each($(svg).find("g"), function(key, value) {
			var id = $(value).attr("target");
			if(id) {
				var newElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
				var path = $(value).find("path")[0];
				var x = parseInt(($(path).offset().left + path.getBoundingClientRect().width/2));
				var y = parseInt(($(path).offset().top + path.getBoundingClientRect().height/2));
				if(self.app.currentZoom == 1) {
					x = (x/2)-30;
					y = y/2;
				}
				if(id == 77) {
					x = x - 20;
					y = y + 20;
				}
				if(id == 76) {
					x = x - 20;
					y = y + 30;
				}
				if(id == 102) {
					x = x - 20;
					y = y + 30;
				}
				if(id == 103) {
					x = x + 30;
				}
				if(id == 104) {
					x = x + 15;
				}
				if(id == 108) {
					x = x - 15;
					y = y - 50;
				}
				$(newElement).html(parseInt(data[id]));
				$(newElement).attr({
					x: x,
					y: y,
					"fill": "#406080",
					"stroke": "white",
					"stroke-width": "1",
					"class": "zoom"+self.app.currentZoom,
					"fill-opacity": "0"
				});

				$(svg).find("svg")[0].appendChild(newElement);	
			}

			$(svg).find("text").attr({
				"fill-opacity": "1"
			});
		});
	}

	this.removeParamValues = function() {
		var svg = this.elements["SVG"][0].getSVGDocument();
		$(svg).find("text").remove();
	}

}

/**
 * [VideoPlayer description]
 */
var VideoPlayer = function() {
	this.CSS = {
		"BG": "bg-video",
		"VIDEO": "video",
		"HEADER": "header",
		"SVG": "#bg-svg"
	}
	this.elements = {
		"BG": document.getElementById(this.CSS["BG"]),
		"VIDEO": document.getElementById(this.CSS["VIDEO"]),
		"HEADER": $(this.CSS["HEADER"]),
		"SVG": $(this.CSS["SVG"])
	}

	this.video = null
	this.videos = []
	this.endedCallback = {}

	this.play = function(videoPath, endedCallback) {
		var self = this;
		this.video = $("#video");
		this.video.attr("src", videoPath)
		this.endedCallback = endedCallback;
		this.video.off("ended");
		this.video.bind('ended', this.endedCallback);
		this.video.bind('play', function() {
			$(self.elements["BG"]).show();
		});
		
		this.video[0].load();
		setTimeout(function() {
			self.video[0].play();
		}, 0);
	}

	this.hide = function() {
		var self = this;
		setTimeout(function() {
			$(self.elements["BG"]).fadeOut();
		}, 0); 
		$(this.elements["VIDEO"]).off('ended', this.endedCallback);
		$(this.elements["VIDEO"]).removeAttr("src");
	}
}

/**
 * [MiniMapWriter Работает с отображением и логикой мини карты слева]
 */
var MiniMapWriter = function() {
	this.CSS = {
		"CONTAINER": "#miniMap",
		"TEXT": " a"
	}
	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
		"TEXT": $(this.CSS["CONTAINER"]+this.CSS["TEXT"])
	}

	this.show = function(imagePath, callback) {
		this.elements["CONTAINER"].addClass("onShow");
		this.elements["TEXT"].css("backgroundImage", "url('"+imagePath+"')");
		this.elements["CONTAINER"].off("click");
		this.elements["CONTAINER"].on("click", callback);
	}

	this.hiden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
		this.elements["TEXT"].css("backgroundImage", "none");
		this.elements["CONTAINER"].off("click");
	}

	this.opacityHidden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
	}

	this.opacityShow = function() {
		this.elements["CONTAINER"].addClass("onShow");
	}

	this.setText = function(text) {
		this.elements["TEXT"].html(text);
	}
}

/**
 * [LoadingState description]
 * @param {[type]} app [description]
 */
var LoadingState = function(app) {
	this.app = app;
	this.stateCSS = {
		"BG-IMAGE": "#bg-image",
		"NAV-ELEMENTS": ".nav-elements",
		"LOADER": "#load",
		"LOAD-IMAGE": "#load-image"
	}
	this.animateSpeed = 2000;

	this.elements = {
		"BG-IMAGE": $(this.stateCSS["BG-IMAGE"]),
		"NAV-ELEMENTS": $(this.stateCSS["NAV-ELEMENTS"]),
		"LOADER": $(this.stateCSS["LOADER"]),
		"LOAD-IMAGE": $(this.stateCSS["LOAD-IMAGE"])
	}

	this.run = function() {
		this.elements["BG-IMAGE"].addClass("blur");
		this.elements["BG-IMAGE"].css("backgroundImage", "url('"+this.app.configManager.getMapById(100)+"')");
		this.elements["LOADER"].addClass("onShow");
	}

	this.stop = function(callback) {
		this.elements["BG-IMAGE"].removeClass("blur");
		this.elements["NAV-ELEMENTS"].addClass("onShow");
		this.elements["LOADER"].removeClass("onShow");

		callback();
	}
}

/**
 * [MapStateManager description]
 * @param {[type]} app [description]
 */
var MapStateManager = function(app) {
	this.miniMapWriter = new MiniMapWriter();
	this.miniMapWriter.setText(this.backTitleText);

	this.stateCSS = {
		"BG-IMAGE": "#bg-image"
	}

	this.stateElements =  {
		"BG-IMAGE": {}
	}

	this.bgImage = new Image;
	this.regions = {};
	this.currentRegionData = {};
	this.stateElements["BG-IMAGE"] = $(this.stateCSS["BG-IMAGE"]);

	this.addBlur = function() {
		this.stateElements["BG-IMAGE"].addClass("blur");
	}

	this.removeBlur = function() {
		this.stateElements["BG-IMAGE"].removeClass("blur");
	}

	this.setCurrentRegion = function(data) {
		this.currentRegionData = data;
		this.app.setAppTitle(this.currentRegionData.name);
		if(this.app.currentZoom != 1) {
			var backId = this.currentRegionData.district_id;
			if(backId == null) {
				backId = this.currentRegionData.country_id;
			}
			this.app.regionManager.getById(backId, $.proxy(this.setPrevRegion, this));
		}
	}

	this.setRootRegions = function(data) {
		this.regions = data;
	}

	this.show = function() {
		//this.app.mapColorel.hidden();
		this.app.regionManager.getByParent(this.app.currentRegion, $.proxy(this.setRootRegions, this));
		this.app.regionManager.getById(this.app.currentRegion, $.proxy(this.setCurrentRegion, this));
		this.app.mapColorWidget.updateParams();
		
		this.setBgImage();

		this.SVGWriter.load(this.app.configManager.getSvgById(this.app.currentRegion));
		this.app.parametrsWidgets.getParamsByRegionAndYeage(this.app.currentRegion);
	}

	this.backgroundImageLoaded_ = function() {
		this.stateElements["BG-IMAGE"].css("backgroundImage", "url('"+this.bgImage.src+"')");
		this.app.videoPlayer.hide();
	}

	this.setBgImage = function(bgImageLoaded) {
		this.bgImage = new Image;
    	this.bgImage.onload = $.proxy(this.backgroundImageLoaded_, this);
    	this.bgImage.src = this.app.configManager.getMapById(this.app.currentRegion);
	}

	this.onBack = function() {
		console.log("back"); 
		this.app.mapColorel.hidden();
		this.miniMapWriter.hiden();
		this.app.videoPlayer.play(this.app.configManager.getOutVideoById(this.app.currentRegion), $.proxy(this.onOutVideoPlayStop_, this));
	}

	this.onOutVideoPlayStop_ = function() {
		this.app.currentRegion = this.prevRegion.id;

		if(this.app.parametrsWidgets.currentParametr != null) {
			this.app.mapColorel.colored(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge
			);	
		}
		
		this.app.prevState();
		this.app.mapStateManager.show();
	}

	this.clear = function() {
		this.miniMapWriter.hiden();
	}

	this.onSvgClick_ = function(evt) {
		var newIdRegion = $(evt.target).parent().attr("target");
		if(newIdRegion) {
			this.app.mapColorel.hidden();
			this.app.currentRegion = $(evt.target).parent().attr("target");
			this.app.videoPlayer.play(this.app.configManager.getInVideoById(this.app.currentRegion), $.proxy(this.onInVideoPlayStop_, this));
			this.miniMapWriter.hiden();
		}
	} 

	this.onInVideoPlayStop_ = function(e) {
		if(this.app.parametrsWidgets.currentParametr != null) {
			this.app.mapColorel.colored(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge
			);	
		}
		this.app.nextState();
		this.app.mapStateManager.show();
	}

	this.setPrevRegion = function(data) {
		this.prevRegion = data;
		this.miniMapWriter.setText(this.prevRegion.name);
		this.miniMapWriter.show(this.app.configManager.getMiniMapById(this.app.currentRegion), $.proxy(this.onBack, this));
	}

	this.app = app;
	this.SVGWriter = new SVGLoader(app, $.proxy(this.onSvgClick_, this));
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
		if(postfix == "png" || postfix == "jpg" || postfix == "gif" || postfix == "mp4") {
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
	this.appSize = [1920, 1080];
	this.currentRegion = 100;
	this.maxZoom = 3;
	this.currentZoom = 1;
	this.russianId = 100;

	this.apiHost = "http://54.224.205.171:3000";

	this.CSS = {
		"APP": "#app",
		"TITLE": "h1"
	}
	this.elements = {
		"APP": $(this.CSS["APP"]),
		"TITLE": $(this.CSS["TITLE"])
	}

	this.regionManager = new RegionManager(this);
	this.paramsManager = new ParamsManager(this);
	this.configManager = new ConfigManager(this, ConfigApp);
	this.mapStateManager = new MapStateManager(this);
	this.legendManager = new LegendManager(this);

	this.resources = ImagePreloaderPrepare(ConfigApp["PRELOAD"]);
	this.videoPlayer = new VideoPlayer();
	this.loadingState = new LoadingState(this);
	this.appTimer = new AppTimer(this);

	this.ageSelectorWidget = new AgeSelectorWidget(this);
	this.ageSelectorFormatWidget = new AgeSelectorFormatWidget(this);
	this.parametrsWidgets = new ParametrsWidgets(this);
	this.mapColorWidget = new MapColorWidget(this);
	this.mapColorel = new MapColorel(this);
	this.legendWidget = new LegendWidget(this);
	this.footerNavWidget = new FooterNavWidget(this);
	this.regionsSelectorWidget = new RegionsSelectorWidget(this);
	this.paramsSelectorWidget = new ParamsSelectorWidget(this);
	this.formatWidget = new FormatWidget(this);
	this.formatManager = new FormatManager(this);

	this.prevState = function() {
		this.currentZoom--;
	}

	this.nextState = function() {
		this.currentZoom++;
	}

	this.run = function() {
		this.loadingState.run();
		this.appTimer.run();
		this.initResource_();
	}

	// загружаем ресурсы
	this.initResource_ = function() {
		var appCache = window.applicationCache;
	   	appCache.addEventListener('noupdate', $.proxy(this.onCacheLoaded_, this), false);
	   	appCache.addEventListener('cached', $.proxy(this.onCacheLoaded_, this), false);
	   	appCache.addEventListener('downloading', function(e) {
	   		$("#load").addClass("onShow");
	   	}, false);
	   	appCache.addEventListener('progress', function(e) {
	   		$("#load").addClass("onShow");
	   		$("#load").find(".text").remove();
	   		$("#load").append('<p class="text" style="font-family: NeoSansPro-Light; position: absolute; left: 41%; top: 60%; color: #ffffff; font-size: 22px;">Загрузено '+e.loaded+' из '+e.total+'</p>');
	   	}, false);
	   	appCache.addEventListener('updateready', function(e) {
	   		window.applicationCache.swapCache(); 
	   		location.reload();
	   	}, false);

	   	
	}

	this.init = function() {
		$(this.elements["APP"]).width(this.appSize[0]).height(this.appSize[1]);
	}

	this.onPanelsShow = function() {
		this.mapStateManager.show();
	}

	this.onCacheLoaded_ = function() {
		var self = this;
		setTimeout(function() {
			self.loadingState.stop(function() {});
			self.onPanelsShow();
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