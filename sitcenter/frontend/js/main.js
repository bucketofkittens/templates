


/**
 * [SVGLoader description]
 * @param {[type]} app [description]
 */
var SVGLoader = function(app, config) {
	this.app = app;
	this.maxOpacity = 0.3;
	this.minOpacity = 0.001;

	if(config && config.onClick) {
		this.onGroupClick = config.onClick;
	}

	this.CSS = {
		"BG": "#bg-svg",
		"SVG": "#svg",
		"IN-SVG-CSS": "#in-svg-css"
	}

	this.elements = {
		"BG": $(this.CSS["BG"]),
		"SVG": $(this.CSS["SVG"]),
		"IN-SVG-CSS": $(this.CSS["IN-SVG-CSS"])
	}

	this.load = function(path) {
		this.elements["BG"].hide();

		var newObject = document.createElement("object");
		newObject.setAttribute("id", "svg");
		newObject.setAttribute("type", "image/svg+xml");
		newObject.setAttribute("data", path);
		newObject.setAttribute("width", "100%");
		newObject.setAttribute("height", "100%");

		this.elements["BG"].html("");
		this.elements["BG"].append(newObject);
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

	this.appendCSS_ = function(svg) {
		var styleElement = svg.createElementNS("http://www.w3.org/2000/svg", "style");
		styleElement.textContent = this.elements["IN-SVG-CSS"].html();
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

		if(this.onGroupClick) {
			groups.on("click", this.onGroupClick);	
		}
	}

	this.drawParamValues = function(data, CSSclasses) {
		this.removeParamValues();

		var svg = $(this.CSS["SVG"])[0].getSVGDocument();
		var self = this;
		
		$.each($(svg).find("g"), function(key, value) {
			var id = $(value).attr("target");
			if(id && data[id] != 0) {
				var newElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
				var path = $(value).find("path")[0];
				var x = parseInt(($(path).offset().left + path.getBoundingClientRect().width/2));
				var y = parseInt(($(path).offset().top + path.getBoundingClientRect().height/2));


				var correctPath = "DISTRICT";

				if(CSSclasses == "regions") {
					correctPath = "REGIONS";
				}
				if(ConfigApp["TARGETS"][correctPath][id]) {
					x = x + parseInt(ConfigApp["TARGETS"][correctPath][id]["x"]);
					y = y + parseInt(ConfigApp["TARGETS"][correctPath][id]["y"]);
				}

				var classes = "zoom"+self.app.currentZoom+" "+CSSclasses;
				var val = parseFloat(data[id]);
				$(newElement).html(val);
				$(newElement).attr({
					x: x,
					y: y,
					"fill": "#ffffff",
					"class": classes,
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
		var svg = $(this.CSS["SVG"])[0].getSVGDocument();
		$(svg).find("text").remove();
	}

}

/**
 * [ description]
 * @return {[type]} [description]
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

	var self = this;
	this.video = $("#video");
	this.endedCallback = {};

	this.video.on('timeupdate',function(e) {
		if(this.duration - this.currentTime < 0.2) {
			self.video[0].pause();
			self.endedCallback();
		}
    });

	this.play = function(videoPath, endedCallback, poster) {
		var self = this;
		this.video.attr("src", videoPath);
		if(poster) {
			this.video.attr("poster", poster);	
		}
		
		this.endedCallback = endedCallback;
		this.video[0].load();
		this.video[0].play();
		$(self.elements["BG"]).show();
	}

	this.hide = function() {
		var self = this;

		$(self.elements["BG"]).hide();
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
		"LOAD-IMAGE": "#load-image",
		"LOADING-TEXT": "#loading"
	}
	this.animateSpeed = 2000;

	this.elements = {
		"BG-IMAGE": $(this.stateCSS["BG-IMAGE"]),
		"NAV-ELEMENTS": $(this.stateCSS["NAV-ELEMENTS"]),
		"LOADER": $(this.stateCSS["LOADER"]),
		"LOAD-IMAGE": $(this.stateCSS["LOAD-IMAGE"]),
		"LOADING-TEXT": $(this.stateCSS["LOADING-TEXT"])
	}

	this.run = function() {
		this.elements["BG-IMAGE"].addClass("blur");
		this.elements["BG-IMAGE"].css("backgroundImage", "url('/static/images/map/100.png')");
		this.elements["LOADER"].addClass("onShow");
	}

	this.stop = function(callback) {
		this.elements["BG-IMAGE"].removeClass("blur");
		this.elements["NAV-ELEMENTS"].addClass("onShow");
		this.elements["LOADER"].removeClass("onShow");

		callback();
	}

	this.updateText = function(currentFile, allFile) {
		this.elements["LOADING-TEXT"].html("");
		this.elements["LOADING-TEXT"].html('Загружено: '+parseInt(currentFile)+' из '+ allFile +' </p>');
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var RegionPanel = function(app) {
	this.app = app;
	this.bgImage = null;
	this.CSS = {
		"BG-IMAGE": "#bg-regions-image",
		"CAMERA-LEFT": "#regions-left-camera",
		"CAMERA-RIGHT": "#regions-right-camera"
	}
	this.currentCamera = "CENTER";

	this.elements = {
		"BG-IMAGE": $(this.CSS["BG-IMAGE"]),
		"CAMERA-LEFT": $(this.CSS["CAMERA-LEFT"]),
		"CAMERA-RIGHT": $(this.CSS["CAMERA-RIGHT"])
	}

	this.svgWriter = new SVGLoader(this);

	this.getBgCurrentCamera = function() {
		return this.app.getResByPath(ConfigApp["REGIONS"][this.currentCamera]["MAP"]).toURL();
	}

	this.getSVGCurrentCamera = function() {
		return this.app.getResByPath(ConfigApp["REGIONS"][this.currentCamera]["SVG"]).toURL();
	}

	this.getVideoName = function(start, end) {
		if(start == "LEFT" && end == "CENTER") {
			return ConfigApp["REGIONS"]["LEFT"]["VIDEO"]["OUT"];
		}
		if(start == "CENTER" && end == "RIGHT") {
			return ConfigApp["REGIONS"]["RIGHT"]["VIDEO"]["IN"];
		}
		if(start == "RIGHT" && end == "CENTER") {
			return ConfigApp["REGIONS"]["RIGHT"]["VIDEO"]["OUT"];
		}
		if(start == "CENTER" && end == "LEFT") {
			return ConfigApp["REGIONS"]["LEFT"]["VIDEO"]["IN"];
		}
	}

	this.setBg = function(bg) {
		if(bg) {
			this.bgImage = bg;	
		}
		if(this.bgImage) {
			this.elements["BG-IMAGE"].css("backgroundImage", "url('"+this.bgImage+"')");
		} else {
			this.elements["BG-IMAGE"].css("backgroundImage", "url('"+this.getBgCurrentCamera()+"')");
		}
	}

	this.show = function() {
		this.elements["BG-IMAGE"].addClass("onShow");
		if(this.currentCamera != "LEFT") {
			this.elements["CAMERA-LEFT"].addClass("onShow");
		}
		if(this.currentCamera != "RIGHT") {
			this.elements["CAMERA-RIGHT"].addClass("onShow");
		}
		this.svgWriter.load(this.getSVGCurrentCamera());
	}

	this.hide = function() {
		this.elements["BG-IMAGE"].removeClass("onShow");
		this.elements["CAMERA-LEFT"].removeClass("onShow");
		this.elements["CAMERA-RIGHT"].removeClass("onShow");
	}

	this.addBlur = function() {
		this.elements["BG-IMAGE"].addClass("blur");
	}

	this.removeBlur = function() {
		this.elements["BG-IMAGE"].removeClass("blur");
	}

	this.onCameraLeftClick_ = function() {
		if(this.currentCamera == "CENTER") {
			this.currentCamera = "LEFT";
			this.elements["CAMERA-LEFT"].removeClass("onShow");
			this.app.videoPlayer.play(
				this.app.getResByPath(this.getVideoName("CENTER", "LEFT")).toURL(),
				$.proxy(this.onVideoPlayEnd_, this),
				this.bgImage
			);
		}
		if(this.currentCamera == "RIGHT") {
			this.currentCamera = "CENTER";
			this.elements["CAMERA-RIGHT"].addClass("onShow");
			this.app.videoPlayer.play(
				this.app.getResByPath(this.getVideoName("RIGHT", "CENTER")).toURL(), 
				$.proxy(this.onVideoPlayEnd_, this),
				this.bgImage
			);
		}
		
	}

	this.onVideoPlayEnd_ = function() {
		var self = this;
		this.setBg(this.getBgCurrentCamera());
		this.svgWriter.load(this.getSVGCurrentCamera());
		if(this.app.regionsParametrsWidgets.currentParametr) {
			this.app.regionsMapColorel.colored(
				this.app.regionsParametrsWidgets.currentParametr.id, 
				this.app.ageSelectorRegionsWidget.selectedAge
			);	
		}
		this.app.regionsMapColorWidget.updateParams();
		setTimeout(function() {
			self.app.videoPlayer.hide();
		}, 0);
		
	}

	this.onCameraRightClick_ = function() {
		if(this.currentCamera == "CENTER") {
			this.currentCamera = "RIGHT";
			this.elements["CAMERA-RIGHT"].removeClass("onShow");
			this.app.videoPlayer.play(
				this.app.getResByPath(this.getVideoName("CENTER", "RIGHT")).toURL(), 
				$.proxy(this.onVideoPlayEnd_, this),
				this.bgImage
			);
		}
		if(this.currentCamera == "LEFT") {
			this.currentCamera = "CENTER";
			this.elements["CAMERA-LEFT"].addClass("onShow");
			this.app.videoPlayer.play(this.app.getResByPath(
				this.getVideoName("LEFT", "CENTER")).toURL(), 
				$.proxy(this.onVideoPlayEnd_, this),
				this.bgImage
			);
		}
	}

	this.bindEvents_ = function() {
		this.elements["CAMERA-LEFT"].on("click", $.proxy(this.onCameraLeftClick_, this));
		this.elements["CAMERA-RIGHT"].on("click", $.proxy(this.onCameraRightClick_, this));
	}

	this.app.regionsParametrsWidgets.getRegionsParams();
	this.bindEvents_();
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
		var self = this;
		this.app.regionManager.getByParent(this.app.currentRegion, $.proxy(this.setRootRegions, this));
		this.app.regionManager.getById(this.app.currentRegion, $.proxy(this.setCurrentRegion, this));
		this.app.mapColorWidget.updateParams();
		
		this.setBgImage();
		this.SVGWriter.load(self.app.configManager.getSvgById(self.app.currentRegion));

		this.app.parametrsWidgets.getParamsByRegionAndYeage(this.app.currentRegion);
	}

	this.backgroundImageLoaded_ = function() {
		var self = this;
		this.stateElements["BG-IMAGE"].css("backgroundImage", "url('"+this.bgImage.src+"')");

		setTimeout(function() {
			self.app.videoPlayer.hide();
		}, 50);
	}

	this.setBgImage = function(bgImageLoaded) {
		this.bgImage = new Image;
    	this.bgImage.onload = $.proxy(this.backgroundImageLoaded_, this);
    	this.bgImage.src = this.app.configManager.getMapById(this.app.currentRegion);
	}

	this.onBack = function() {
		this.app.mapColorel.hidden();
		this.miniMapWriter.hiden();
		this.app.videoPlayer.play(
			this.app.configManager.getOutVideoById(this.app.currentRegion), 
			$.proxy(this.onOutVideoPlayStop_, this),
			this.bgImage.src);
	}

	this.onOutVideoPlayStop_ = function() {
		this.app.currentRegion = this.prevRegion.id;
		var self = this;
		if(this.app.parametrsWidgets.currentParametr != null) {
			this.app.mapColorel.colored(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge,
				function() {
					self.app.prevState();
					self.app.mapStateManager.show();
				}
			);	
		} else {
			self.app.prevState();
			self.app.mapStateManager.show();
		}
	}

	this.clear = function() {
		this.miniMapWriter.hiden();
	}

	this.onSvgClick_ = function(evt) {
		var newIdRegion = $(evt.target).parent().attr("target");
		if(newIdRegion) {
			var inVideo = this.app.configManager.getInVideoById($(evt.target).parent().attr("target"));
			if(inVideo) {
				this.app.currentRegion = $(evt.target).parent().attr("target");
				console.log(this.app.currentRegion);
				this.app.mapColorel.hidden();
				this.app.videoPlayer.play(inVideo, $.proxy(this.onInVideoPlayStop_, this), this.bgImage.src);
				this.miniMapWriter.hiden();	
			}
		}
	} 

	this.onInVideoPlayStop_ = function(e) {
		var self = this;
		if(this.app.parametrsWidgets.currentParametr != null) {
			this.app.mapColorel.colored(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge,
				function() {
					self.app.nextState();
					self.app.mapStateManager.show();
				}
			);	
		} else {
			self.app.nextState();
			self.app.mapStateManager.show();
		}
		
	}

	this.setPrevRegion = function(data) {
		this.prevRegion = data;
		this.miniMapWriter.setText(this.prevRegion.name);
		this.miniMapWriter.show(this.app.configManager.getMiniMapById(this.app.currentRegion), $.proxy(this.onBack, this));
	}

	this.app = app;
	this.SVGWriter = new SVGLoader(app, {
		onClick: $.proxy(this.onSvgClick_, this)
	});
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

	this.apiHost = ConfigApp["API-HOST"];

	this.loadingState = new LoadingState(this);
	this.configManager = new ConfigManager(this, ConfigApp);
	this.appTimer = new AppTimer(this);
	this.footerNavWidget = new FooterNavWidget(this);

	this.onDistrictUpdateMapEvent = new signals.Signal();
	this.onDistrictUpdateMapEvent.add(OnDistrictUpdateMapEvent);

	this.onFormatUpdateContentEvent = new signals.Signal();
	this.onFormatUpdateContentEvent.add(OnFormatUpdateContentEvent);

	this.allCacheFile = $(ConfigApp["PRELOAD"]).size();
	this.cachedFile = 0;
	this.res = {};

	var self = this;

	this.getResByPath = function(path) {
		return this.res[path];
	}
	
	this.CSS = {
		"APP": "#app",
		"TITLE": "h1"
	}
	this.elements = {
		"APP": $(this.CSS["APP"]),
		"TITLE": $(this.CSS["TITLE"])
	}

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
		this.footerNavWidget.draw();
	}

	// загружаем ресурсы
	this.initResource_ = function() {
		ImgCache.init(function(){
			$.each(ConfigApp["PRELOAD"],function(key, value) {
				ImgCache.isCached(value, function(e, state, file) {
					if(state == false) {
						ImgCache.cacheFile(value, function(file) {
							self.loadingState.updateText(self.cachedFile, self.allCacheFile);
							self.res[value] = file;
							self.cachedFile = self.cachedFile + 1;
							if(self.allCacheFile == self.cachedFile) {
								self.onCacheLoaded_();
							}
						}, function() {
							location.reload();
						});
					} else {
						self.loadingState.updateText(self.cachedFile, self.allCacheFile);
						self.res[e] = file;
						self.cachedFile = self.cachedFile + 1;
					}
					
					if(self.allCacheFile == self.cachedFile) {
						self.onCacheLoaded_();
					}
				});
			});
		});

		$(document).on("keydown", function(e) {
	        if (e.keyCode == 82 && e.altKey) {
	           ImgCache.clearCache(function() {
	           	location.reload();
	           });
	        }
	    });
	}

	this.init = function() {
		$(this.elements["APP"]).width(this.appSize[0]).height(this.appSize[1]);
	}

	this.onPanelsShow = function() {
		this.mapStateManager.show();
	}

	this.onDistrictUpdateMapEventBind_ = function() {
		this.onDistrictUpdateMapEvent.dispatch(this);
	}

	this.onFormatUpdateContentEventBind_ = function() {
		this.onFormatUpdateContentEvent.dispatch(this);
	}

	this.onCacheLoaded_ = function() {
		$("#load").find(".text").remove();

		this.regionManager = new RegionManager(this);
		this.paramsManager = new ParamsManager(this);
		
		this.mapStateManager = new MapStateManager(this);
		this.legendManager = new LegendManager(this);
		this.graphManager = new GraphManager(this);
		this.regionsManagerLocal = new RegionsManagerLocal(this);

		this.videoPlayer = new VideoPlayer();
		
		this.ageSelectorWidget = new YearSelectWidget(this, {
			years: [2012, 2011],
			selectedYear: 2012,
			container: "#age_select",
			onAfterYearSelected: $.proxy(this.onDistrictUpdateMapEventBind_, this)
		});
		this.ageSelectorFormatWidget = new YearSelectWidget(this, {
			years: [2012, 2011, 2010, 2009, 2008],
			selectedYear: 2012,
			container: "#params-age-selected",
			onAfterYearSelected: $.proxy(this.onFormatUpdateContentEventBind_, this)
		});
		this.ageSelectorRegionsWidget = new YearSelectWidget(this, {
			years: [2012],
			selectedYear: 2012,
			container: "#regions_age_select"
		});
		this.parametrsWidgets = new ParametrsWidgets(this);
		this.mapColorWidget = new MapColorWidget(this);
		this.mapColorel = new MapColorel(this);
		this.regionsMapColorel = new RegionsMapColorel(this);
		this.legendWidget = new LegendWidget(this);
		this.regionsLegendWidget = new RegionsLegendWidget(this);
		
		this.regionsSelectorWidget = new RegionsSelectorWidget(this);
		this.paramsSelectorWidget = new ParamsSelectorWidget(this);
		this.formatWidget = new FormatWidget(this);
		this.graphWidget = new GraphWidget(this);
		this.formatManager = new FormatManager(this);
		this.graphParamsSelector = new GraphParamsSelector(this);
		this.graphRegionsSelectorWidget = new GraphRegionsSelectorWidget(this);

		this.regionsMapColorWidget = new RegionsMapColorWidget(this);
		
		this.regionsParametrsWidgets = new RegionsParametrsWidgets(this);
		this.regionsLegendWidget = new RegionsLegendWidget(this);

		this.regionPanel = new RegionPanel(this);

		this.regionsMapColorWidget.enable();
		this.mapColorWidget.enable();

		var self = this;
		setTimeout(function() {
			self.loadingState.stop(function() {});
			self.onPanelsShow();
		}, 0);
	}

	this.setAppTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	

	//this.onCacheLoaded_();

	this.init();
}


$(document).ready(function() {
	var application = new Application();
	application.run();
	
})

window.applicationCache.addEventListener('updateready', function(e) {
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		window.applicationCache.swapCache();
	  window.location.reload();
	} else {
	}
}, false);