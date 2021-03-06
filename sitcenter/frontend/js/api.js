/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var RegionsParametrsWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.currentParametr = null;
	this.CSS = {
		"SHOW": "#regions-paramers-show",
		"MAIN": "#regions-parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": "#regions-parametrs-widget > .hidden",
		"PARAMETRS-LIST": "#regions-parametrs-list",
		"TITLE": "#regions-parametrs-widget h3",
		"FILTER": "#regions-params-filter",
		"AGE-SELECT": "#regions_age_select",
		"UOM": "#regions-param-info",
		"MAP-PARAMS": "#regions-params"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"]),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"UOM": $(this.CSS["UOM"]),
		"MAP-PARAMS": $(this.CSS["MAP-PARAMS"])
	}

	this.animateStep = "-350px";
	this.animateSpeed = 1000;
	this.legendWidget = new RegionsLegendWidget(this.app);
	this.scrollApi = null;

	this.fullHidden = function() {
		this.elements["MAP-PARAMS"].addClass("hidden");
	}

	this.fullShow = function() {
		this.elements["MAP-PARAMS"].removeClass("hidden");
	}

	this.parametrsClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.getParametrById = function(id) {
		var par = null;
		console.log(this.parametrs);
		$.each(this.parametrs, function(key, value) {
			console.log(key);

			if(value && value.id == id) {
				par = value;
			}
		});

		return par;
	}

	this.parametrsNameClick_ = function(evt) {
		if(!$(evt.target).hasClass("active")) {
			var self = this;
			var parentLi = $(evt.target).parent().parent();
			$(this.CSS["SCROLL"]).find(".active").removeClass("active");
			$(evt.target).toggleClass("active");
			
			this.setTitle($(evt.target).html());
			this.currentParametr = this.getParametrById(parentLi.attr("data-id"));
			this.app.regionsMapColorel.colored(
				this.currentParametr.id, 
				this.app.ageSelectorRegionsWidget.selectedYear
			);
			this.app.regionsMapColorWidget.updateParams();
			this.elements["UOM"].html(parentLi.attr("data-uom"));
		} else {
			/*$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			this.setTitle("");
			this.currentParametr = null;
			this.elements["UOM"].html("");
			this.app.regionsMapColorWidget.onToggle_();
			this.app.regionsLegendWidget.hide();
			this.app.regionsMapColorel.hidden();*/
		}
	}

	this.setTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			
			ret[value.group_id].parameters.push({
				id: value.param_id,
				name: value.param_name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.getParametrs_ = function(data) {
		var self = this;
		this.parametrs = data;
		this.drawRegionsParamets_(this.parametrs);

		$(this.CSS["PARAMETRS-LIST"]+" .name").on("click", $.proxy(this.parametrsNameClick_, this));

		if(this.currentParametr) {
			this.app.legendManager.getLegendByParamAndSubject(
				this.currentParametr.id, 
				this.app.currentRegion,
				function(data) {
					self.legendWidget.setLevelText(data);
					self.legendWidget.show();
				}
			);	
		}
		
	}

	this.initScroll_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["PARAMETRS-LIST"].data('jsp');
	}

	this.drawRegionsParamets_ = function(params) {
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();
		var html =  "<ul class='first regions-params'>"
		$.each(params, function(key, value) {
			var uom = value.uom_name == null ? "" : value.uom_name;
			html += "<li data-uom='"+uom+"' data-name='"+value.name+"' data-id='"+value.id+"'><span  class='param'><em class='spr'>-</em> <em class='name'>"+value.name+"</em></span></li>";
		});
		html += "</ul>";
		contentPane.append(html);

		this.scrollApi.reinitialise();
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
			this.animateSpeed/4,
			$.proxy(this.onMainHiddened_, this) 
		);
		this.legendWidget.hide();
		return false;
	}

	this.onShow_ = function() {
		//this.elements["SHOW"].addClass("onRight");
		this.elements["SHOW"].animate({
				right: this.animateStep
			},
			this.animateSpeed/2,
			$.proxy(this.onMainShowed_, this) 
		);
		
		return false;
	}

	this.onMainShowed_ = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});
		
		this.elements["MAIN"].animate({
				right: "0px"
			},
			this.animateSpeed
		);

		if(this.currentParametr != null) {
			//this.legendWidget.show();
		}
		this.initScroll_();
	}

	this.onMainHiddened_ = function() {
		
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();
		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["PARAMETRS-LIST"]).find("ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
		
	}

	this.getParamsByRegionAndYeage = function(region_id) {
		this.app.paramsManager.getParamsByRegionAndYeage(
			region_id, 
			this.app.ageSelectorRegionsWidget.selectedYear, 
			$.proxy(this.getParametrs_, this)
		);
	}

	this.getRegionsParams = function() {
		this.app.paramsManager.getRegionsParams($.proxy(this.getParametrs_, this));
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorRegionsWidget.draw();
}

/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var ParametrsWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.currentParametr = null;
	this.CSS = {
		"SHOW": "#paramers-show",
		"MAIN": "#parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": ".hidden",
		"PARAMETRS-LIST": "#parametrs-list",
		"TITLE": "#parametrs-widget h3",
		"FILTER": "#params-filter",
		"AGE-SELECT": "#age_select",
		"UOM": "#param-info",
		"MAP-PARAMS": "#map-params"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"]),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"UOM": $(this.CSS["UOM"]),
		"MAP-PARAMS": $(this.CSS["MAP-PARAMS"])
	}

	this.animateStep = "-350px";
	this.animateSpeed = 1000;
	this.legendWidget = new LegendWidget(this.app);
	this.scrollApi = null;

	this.fullHidden = function() {
		this.elements["MAP-PARAMS"].addClass("hidden");
	}

	this.fullShow = function() {
		this.elements["MAP-PARAMS"].removeClass("hidden");
	}

	this.parametrsClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.getParametrById = function(id) {
		var par = null;
		console.log(this.parametrs);
		$.each(this.parametrs, function(key, value) {
			$.each(value.parameters, function(key2, value2) {
				if(value2 && value2.id == id) {
					par = value2;
				}
			});
		});

		return par;
	}

	this.coloredLoad_ = function() {
		this.app.mapColorel.show();
	}

	this.parametrsNameClick_ = function(evt) {
		if(!$(evt.target).hasClass("active")) {
			var self = this;
			var parentLi = $(evt.target).parent().parent();
			$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			$(evt.target).toggleClass("active");

			this.setTitle($(evt.target).html());

			this.currentParametr = this.getParametrById(parentLi.attr("data-id"));
			this.app.mapColorel.colored(
				this.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedYear,
				$.proxy(this.coloredLoad_, this) 
			);
			this.app.mapColorWidget.updateParams();
			this.app.paramsManager.getParamUom(this.currentParametr.id, function(data) {
				if(data && data.responseText) {
					self.elements["UOM"].html(data.responseText);
				} else {
					self.elements["UOM"].html("");
				}
			});
			this.app.legendManager.getLegendByParamAndSubject(
				this.currentParametr.id, 
				this.app.currentRegion
			);
		} else {
			/*$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			this.setTitle("");
			this.currentParametr = null;
			this.elements["UOM"].html("");
			this.app.mapColorWidget.onToggle_();
			this.legendWidget.hide();
			this.app.mapColorel.hidden();*/
		}
	}

	this.setTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
						
			ret[value.group_id].parameters.push({
				id: value.param_id,
				name: value.param_name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.getParametrs_ = function(data) {
		var self = this;
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		if(this.currentParametr) {
			this.app.legendManager.getLegendByParamAndSubject(
				this.currentParametr.id, 
				this.app.currentRegion,
				function(data) {
					//self.legendWidget.setLevelText(data);
					//self.legendWidget.show();
				}
			);	
		}
		
	}

	this.initScroll_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["PARAMETRS-LIST"].data('jsp');
	}

	this.drawParamets_ = function(params) {
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["PARAMETRS-LIST"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<a class='group'>"+value.name+"</a>";
					html += "<ul></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["PARAMETRS-LIST"]);

			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["PARAMETRS-LIST"]);
					if(value2.value == null) {
						value2.value = "";
					}
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param'><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><i>"+value2.value+"</i></li>";

						elementCurrentGroup.find("ul").append(html);
					} else {
						paramCurrent.find("i").html(value2.value);
					}
				});	
			}
		});
		this.scrollApi.reinitialise();
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
			this.animateSpeed/4,
			$.proxy(this.onMainHiddened_, this) 
		);
		this.legendWidget.hide();
		return false;
	}

	this.onShow_ = function() {
		//this.elements["SHOW"].addClass("onRight");
		this.elements["SHOW"].animate({
				right: this.animateStep
			},
			this.animateSpeed/2,
			$.proxy(this.onMainShowed_, this) 
		);
		
		return false;
	}

	this.onMainShowed_ = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});
		
		this.elements["MAIN"].animate({
				right: "0px"
			},
			this.animateSpeed
		);

		if(this.currentParametr != null) {
			//this.legendWidget.show();
		}
		this.initScroll_();
	}

	this.onMainHiddened_ = function() {
		
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();
		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["PARAMETRS-LIST"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		var elems = $(this.CSS["PARAMETRS-LIST"]).find("ul");
		$.each(elems, function(key, value) {
			if($(value).find("li ul li:not(.hidde)").size() == 0) {
				$(value).addClass("hidde");
			}
		})
		
	}

	this.getParamsByRegionAndYeage = function(region_id) {
		this.app.paramsManager.getParamsByRegionAndYeage(
			region_id, 
			this.app.ageSelectorWidget.selectedYear, 
			$.proxy(this.getParametrs_, this)
		);
	}

	this.getRegionsParams = function() {
		this.app.paramsManager.getRegionsParams($.proxy(this.getParametrs_, this));
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));

		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" li.first-li", $.proxy(this.parametrsClick_, this));
		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" .name", $.proxy(this.parametrsNameClick_, this));
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorWidget.draw();
}

/**
 * [LegendWidget description]
 * @param {[type]} app [description]
 */
var LegendWidget = function(app) {
	this.app =  app;
	this.animateStep = "-400px";
	this.animateSpeed = 1000;
	this.isShow = false;

	

	this.CSS = {
		"MAIN": "#legend-widget"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}

	$(this.CSS["MAIN"]).find("p:first-child").html("нет<br /> данных");

	this.show = function() {
		if(!this.isShow) {
			this.elements["MAIN"].css({
				right: this.animateStep,
				display: "block"
			});
			this.elements["MAIN"].animate({
					right: "0px"
				},
				this.animateSpeed
			);

			this.isShow = true;
		}
		
	}

	this.setLevelText = function(data) {
		var $p = $(this.CSS["MAIN"]).find("p");
		$.each($p, function(key, value) {
			if(key == 0) {
				$(value).html("нет<br /> данных");
			}
			if(key == 1 && data["red"]) {
				var string = "";
				if(data["red"][0]) {
					string += parseInt(data["red"][0]);
				}
				if(data["red"][1]) {
					if(data["red"][0]) {
						string += "-";
					}
					string += parseInt(data["red"][1]);
				}
			}
			if(key == 2 && data["yellow"]) {
				var string = "";
				if(data["yellow"][0]) {
					string += parseInt(data["yellow"][0]);
				}
				if(data["yellow"][1]) {
					if(data["yellow"][0]) {
						string += "-";
					}
					string += parseInt(data["yellow"][1]);
				}
				$(value).html(string);
			}
			if(key == 3 && data["green"]) {
				var string = "";
				if(data["green"][0]) {
					string += parseInt(data["green"][0]);
				}
				if(data["green"][1]) {
					if(data["green"][0]) {
						string += "-";
					}
					string += parseInt(data["green"][1]);
				}
				$(value).html(string);
			}
		});
	}

	this.hide = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed 
		);

		this.isShow = false;
	}
}

/**
 * [LegendWidget description]
 * @param {[type]} app [description]
 */
var RegionsLegendWidget = function(app) {
	this.app =  app;
	this.animateStep = "-400px";
	this.animateSpeed = 1000;
	this.isShow = false;

	this.CSS = {
		"MAIN": "#regions-legend-widget"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}

	this.show = function() {
		if(!this.isShow) {
			this.elements["MAIN"].css({
				right: this.animateStep,
				display: "block"
			});
			this.elements["MAIN"].animate({
					right: "0px"
				},
				this.animateSpeed
			);

			this.isShow = true;
		}
		
	}

	this.hide = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed 
		);

		this.isShow = false;
	}
}

/**
 * [MapColorWidget description]
 * @param {[type]} app [description]
 */
var MapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		var ret = {};
		$.each(data, function(key, value) {
			if(value.val_numeric != 0) {
				ret[value.subject_id] = value.val_numeric;	
			}
		});
		this.app.mapStateManager.SVGWriter.drawParamValues(ret);
	}

	this.updateParams = function() {
		if(this.state && this.app.parametrsWidgets.currentParametr) {
			this.app.paramsManager.getParamValues(
				this.app.parametrsWidgets.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedYear,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.elements["TOGGLE"].addClass("onShow");
			this.state = true;

			this.updateParams();
		} else {
			this.elements["TOGGLE"].removeClass("onShow");
			this.state = false;
			this.app.mapStateManager.SVGWriter.removeParamValues();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [MapColorWidget description]
 * @param {[type]} app [description]
 */
var MapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		this.app.mapStateManager.SVGWriter.drawParamValues(data);
	}

	this.updateParams = function() {
		if(this.state && this.app.parametrsWidgets.currentParametr) {
			this.app.paramsManager.getParamValues(
				this.app.parametrsWidgets.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedYear,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

 	this.enable = function() {
 		this.elements["TOGGLE"].addClass("onShow");
		this.state = true;

		this.updateParams();
 	}

 	this.disable = function() {
 		this.elements["TOGGLE"].removeClass("onShow");
		this.state = false;
		this.app.mapStateManager.SVGWriter.removeParamValues();
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.enable();
		} else {
			this.disable();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [RegionsMapColorWidget description]
 * @param {[type]} app [description]
 */
var RegionsMapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#regions-map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		var ret = {};
		$.each(data, function(key, value) {
			if(value.val_numeric != 0) {
				ret[value.subject_id] = value.val_numeric;	
			}
		});
		this.app.mapStateManager.SVGWriter.drawParamValues(ret, "regions");
	}

	this.updateParams = function() {
		if(this.state && this.app.regionsParametrsWidgets.currentParametr) {
			this.app.paramsManager.getRegionsParamValues(
				this.app.regionsParametrsWidgets.currentParametr.id,
				this.app.ageSelectorRegionsWidget.selectedYear,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

 	this.enable = function() {
 		this.elements["TOGGLE"].addClass("onShow");
		this.state = true;

		this.updateParams();
 	}

 	this.disable = function() {
 		this.elements["TOGGLE"].removeClass("onShow");
		this.state = false;
		this.app.mapStateManager.SVGWriter.removeParamValues();
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.enable();
		} else {
			this.disable();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [MapColorel description]
 * @param {[type]} app [description]
 */
var MapColorel = function(app) {
	this.app = app;
	this.ajaxPath = "/subjects/";
	this.CSS = {
		"CONTAINER": "#bg-colored-image",
		"LOAD": "#load"
	};
	this.isShowed = false;

	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
		"IMAGE": $(this.CSS["CONTAINER"]).find("img")
	}


	this.colored = function(params_id, region_id, year, callback) {
		var self = this;
		var mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+region_id+"/"+year+"/map";

		if(this.isShowed) {
			this.elements["CONTAINER"].removeClass("onShow");
		}
		$.ajax({ url: mapPath }).always(function(data) {
			self.onGetMapLink_(data, callback);
		});
	}

	this.onGetMapLink_ = function(data, callback) {
		var link = data.responseText;
		var self = this;
		var image = new Image();

        image.src = self.app.apiHost+link;

        image.onload = function() {
    		self.elements["CONTAINER"].css("backgroundImage", "url('"+self.app.apiHost+link+"')");
    		if(callback) {
        		callback();
			}
        }
	}

	this.show = function() {
		this.elements["CONTAINER"].addClass("onShow");
		this.isShowed = true;
	}

	this.hidden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
		this.isShowed = false;
	}
}

/**
 * [MapColorel description]
 * @param {[type]} app [description]
 */
var RegionsMapColorel = function(app) {
	this.app = app;
	this.ajaxPath = "/param_values/";
	this.CSS = {
		"CONTAINER": "#bg-regions-image",
		"LOAD": "#load"
	};
	this.isShowed = false;

	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
		"IMAGE": $(this.CSS["CONTAINER"]).find("img")
	}

	this.getColoredPath = function(params_id, year) {
		var mapPath = "";
		if(this.app.regionPanel.currentCamera == "CENTER") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map";
		}

		if(this.app.regionPanel.currentCamera == "LEFT") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map-west";
		}

		if(this.app.regionPanel.currentCamera == "RIGHT") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map-east";
		}

		return mapPath;
	}


	this.colored = function(params_id, year) {
		//$(this.CSS["LOAD"]).addClass("onShow");

		if(this.isShowed) {
			this.elements["CONTAINER"].removeClass("onShow");
		}
		$.ajax({ url: this.getColoredPath(params_id, year) }).always($.proxy(this.onGetMapLink_, this));
	}

	this.onGetMapLink_ = function(data) {
		var link = data.responseText;
		var self = this;
		var image = new Image();

        image.src = self.app.apiHost+link;

        image.onload = function() {
        	console.log(self.app.apiHost+link);
        	self.app.regionPanel.setBg(self.app.apiHost+link);
			self.elements["CONTAINER"].addClass("onShow");
			//$(self.CSS["LOAD"]).removeClass("onShow");
        }
	}

	this.show = function() {
		this.elements["CONTAINER"].addClass("onShow");
		this.isShowed = true;
	}

	this.hidden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
		this.isShowed = false;
	}
}

/**
 * [RegionsSelector description]
 * @param {[type]} app [description]
 */
var RegionsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#regions-selector",
		"HIDDEN": "hidden",
		"SHOW": "#regions-nav-show",
		"DATA": "#region-data",
		"DATA-HIDDEN": "#region-data-hidden",
		"DATA-PLACE": "#region-data-place",
		"FILTER": "#region-selector-filter",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER": $(this.CSS["FILTER"])
	}

	this.regions = {};

	this.isDataShow = false;
	this.scrollApi = null;

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
		this.initScroll_();
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));
	}

	this.onRegionClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}

	this.onRegionNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onResponseRegions_ = function(data) {
		this.regions = data;
		this.elements["DATA-PLACE"].html(this.findRegionsByParent_(data, this.app.russianId, "", ""));
		this.addChilds(data);

		this.app.paramsManager.getParamsByRegionAndAge(
			this.getCurrentIds(),
			this.app.ageSelectorFormatWidget.selectedYear
		);

		this.app.paramsSelectorWidget.updateParams(this.getCurrentIds(), this.app.ageSelectorFormatWidget.selectedYear);
			
		$(this.CSS["DATA-PLACE"]+ " li a").on("click", $.proxy(this.onRegionClick_, this));
		$(this.CSS["DATA-PLACE"]+ " li span").on("click", $.proxy(this.onRegionNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
		
	}

	this.findRegionsByParent_ = function(data, parent, html, sep) {
		html += "<ul>";
		var self = this;
		$.each(data, function(key, value) {
			if(parent == value.parent_id) {
				html += '<li data-name='+value.name+' data-id="'+value.id+'"><span class="group"> '+sep+value.name+'</span><a class="current" href="#"></a></li>';
				delete data[value];
			}
		});
		html += "</ul>";
		return html;
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.addChilds = function(data) {
		var self = this;
		$.each($(this.elements["DATA-PLACE"]).find("li"), function(key, value) {
			var html = self.findRegionsByParent_(data, $(value).attr("data-id"), "", " - ");
			$(value).append(html);
		});
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
	}

	this.bindEvents_();
	this.app.regionManager.getAll($.proxy(this.onResponseRegions_, this));
}

/**
 * [RegionsSelector description]
 * @param {[type]} app [description]
 */
var ParamsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#params-selector",
		"HIDDEN": "hidden",
		"SHOW": "#params-nav-show",
		"DATA": "#params-data",
		"DATA-HIDDEN": "#params-data-hidden",
		"DATA-PLACE": "#params-data-place",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER":  $(this.CSS["DATA"]).find("input")
	}

	this.isDataShow = false;
	this.parametrs = {};
	this.scrollApi = null;

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));

		$(this.CSS["DATA-PLACE"]).on("click", ".params-checkbox" , $.proxy(this.onParamClick_, this));
		$(this.CSS["DATA-PLACE"]).on("click", ".params-name", $.proxy(this.onParamNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onParamsGet_ = function(data) {
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		this.app.formatWidget.updateContent();
	}

	this.updateParams = function(ids, age) {
		this.app.paramsManager.getParamsByRegionAndAge(
			ids,
			age,
			$.proxy(this.onParamsGet_, this)
		);
	}

	this.drawParamets_ = function(params) {
		if(!this.scrollApi) {
			this.initScroll_();
		}
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<span class='group params-name params-checkbox'>"+value.name+"</span><a href='#' class='params-checkbox current'></a>";
					html += "<ul></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);

			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["DATA-PLACE"]);
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param params-name '><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><a class='params-checkbox current' href='#'></a></li>";

						elementCurrentGroup.find("ul").append(html);
					} else {
						paramCurrent.find("i").html(value2.value);
					}
				});	
			}
		});
		this.scrollApi.reinitialise();
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			ret[value.group_id].parameters.push({
				id: value.id,
				name: value.name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.onParamClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}

	this.onParamNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorFormatWidget.draw();
	
}

/**
 * [FormatWidget description]
 * @param {[type]} app [description]
 */
var FormatWidget = function(app) {
	this.app = app;
	this.scrollApi = null;
	this.CSS = {
		"MAIN": "#format-data",
		"HIDDEN": "hidden",
		"DATA-PLACE": "#table-format",
		"LOAD": "#load"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"])
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.updateContent = function() {
		this.app.formatManager.getFormat(
			this.app.regionsSelectorWidget.getCurrentIds(),
			this.app.paramsSelectorWidget.getCurrentIds(),
			this.app.ageSelectorFormatWidget.selectedYear,
			$.proxy(this.draw_, this)
		);
	}

	this.draw_ = function(data) {
		$(this.CSS["LOAD"]).removeClass("onShow");

		var contentPane = this.scrollApi.getContentPane();
		var self = this;
		var main = this.elements["MAIN"].find("tbody");

		main.html("");
		$.each(data, function(key, value) {
			var html = "<tr>";
			html += '<td>'+value.parameter_name+'</td><td>'+value.subject_name+'</td><td>'+value.val_numeric+'</td><td>'+value.year+'</td>';
			html += "</tr>";
			main.append(html);
		});
		self.scrollApi.reinitialise();
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.initScroll_();
}


/**
 * [GraphParametrsWidgets description]
 * @param {[type]} app [description]
 */
var GraphParamsSelector = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#graph-selector",
		"HIDDEN": "hidden",
		"SHOW": "#graph-nav-show",
		"DATA": "#graph-data",
		"DATA-HIDDEN": "#graph-data-hidden",
		"DATA-PLACE": "#graph-data-place",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER":  $(this.CSS["DATA"]).find("input")
	}

	this.isDataShow = false;
	this.parametrs = {};
	this.scrollApi = null;
	this.onUpdateGraph = new signals.Signal();
	this.onUpdateGraph.add(OnGraphUpdateEvent);

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));

		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-checkbox" , $.proxy(this.onParamClick_, this));
		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-name", $.proxy(this.onParamNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onParamsGet_ = function(data) {
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		this.app.formatWidget.updateContent();
	}

	this.updateParams = function(ids, age) {
		this.app.paramsManager.getParamsByRegionAndAge(
			ids,
			age,
			$.proxy(this.onParamsGet_, this)
		);
	}

	this.drawParamets_ = function(params) {
		if(!this.scrollApi) {
			this.initScroll_();
		}
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<span class='group graph-params-name'>"+value.name+"</span><a href='#' class='graph-params-checkbox'></a>";
					html += "<ul class='itemShow'></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);

			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["DATA-PLACE"]);
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param params-name '><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><a class='graph-params-checkbox' href='#'></a></li>";

						elementCurrentGroup.find("ul").append(html);
					} else {
						paramCurrent.find("i").html(value2.value);
					}
				});	
			}
		});
		this.scrollApi.reinitialise();
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			ret[value.group_id].parameters.push({
				id: value.id,
				name: value.name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.onParamClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.onUpdateGraph.dispatch(this.app);
	}

	this.onParamNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").toggleClass("itemShow");
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
	}

	this.onResponseRegions_ = function(regions) {
		var ids = [];
		$.each(regions, function(key, value) {
			ids.push(value.id);
		});
		this.updateParams(ids, 2012);
	}

	this.initScroll_();
	this.bindEvents_();

	this.app.regionsManagerLocal.getRegions($.proxy(this.onResponseRegions_, this));
	this.app.ageSelectorFormatWidget.draw();
}


/**
 * [GraphRegionsSelectorWidget description]
 * @param {[type]} app [description]
 */
var GraphRegionsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#graph-regions-selector",
		"HIDDEN": "hidden",
		"SHOW": "#graph-regions-nav-show",
		"DATA": "#graph-region-data",
		"DATA-HIDDEN": "#graph-region-data-hidden",
		"DATA-PLACE": "#graph-region-data-place",
		"FILTER": "#graph-region-selector-filter",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER": $(this.CSS["FILTER"])
	}

	this.regions = {};

	this.isDataShow = false;
	this.scrollApi = null;
	this.onUpdateGraph = new signals.Signal();
	this.onUpdateGraph.add(OnGraphUpdateEvent);

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
		this.initScroll_();
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));
	}

	this.onRegionClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.onUpdateGraph.dispatch(this.app);
	}

	this.onRegionNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").toggleClass("itemShow");
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onResponseRegions_ = function(data) {
		this.regions = data;
		this.elements["DATA-PLACE"].html(this.findRegionsByParent_(data, this.app.russianId, "", ""));
		this.addChilds(data);
			
		$(this.CSS["DATA-PLACE"]+ " li a").on("click", $.proxy(this.onRegionClick_, this));
		$(this.CSS["DATA-PLACE"]+ " li span").on("click", $.proxy(this.onRegionNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
		
	}

	this.findRegionsByParent_ = function(data, parent, html, sep) {
		html += "<ul>";
		var self = this;
		$.each(data, function(key, value) {
			if(parent == value.parent_id) {
				html += '<li data-name='+value.name+' data-id="'+value.id+'"><span class="group"> '+sep+value.name+'</span><a href="#"></a></li>';
				delete data[value];
			}
		});
		html += "</ul>";
		return html;
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.addChilds = function(data) {
		var self = this;
		$.each($(this.elements["DATA-PLACE"]).find("li"), function(key, value) {
			var html = self.findRegionsByParent_(data, $(value).attr("data-id"), "", " - ");
			$(value).append(html);
		});
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);	
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
	}

	this.bindEvents_();
	this.app.regionsManagerLocal.getRegions($.proxy(this.onResponseRegions_, this));
}

/**
 * [GraphWidget description]
 * @param {[type]} app [description]
 */
var GraphWidget = function(app) {
	this.app = app;
	this.scrollApi = null;
	this.onUpdateGraph = new signals.Signal();
	this.onUpdateGraph.add(OnGraphUpdateEvent);

	this.CSS = {
		"MAIN": "#graph-content",
		"HIDDEN": "hidden",
		"LOAD": "#load",
		"GRAPH": "#graph-panel",
		"DATES": "#graph-datas",
		"DATA-BEGIN": "#graph-datas-begin",
		"DATA-END": "#graph-datas-end"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"DATA-BEGIN": $(this.CSS["DATA-BEGIN"]),
		"DATA-END": $(this.CSS["DATA-END"]),
		"GRAPH": $(this.CSS["GRAPH"])
	}

	this.ageSelectorGraphStartWidget = new YearSelectWidget(this, {
		years: [2011, 2012],
		selectedYear: 2012,
		container: "#graph-datas-begin",
		onAfterYearSelected: $.proxy(this.onUpdateGraphDispather_, this)
	});

	this.ageSelectorGraphEndWidget = new YearSelectWidget(this, {
		years: [2011, 2012],
		selectedYear: 2012,
		container: "#graph-datas-end",
		onAfterYearSelected: $.proxy(this.onUpdateGraphDispather_, this)
	});

	this.ageSelectorGraphStartWidget.draw();
	this.ageSelectorGraphEndWidget.draw();

	this.onUpdateGraphDispather_ = function() {
		this.onUpdateGraph.dispatch(this.app);
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.updateContent = function(data) {
		var lines = [];
		var options = {
		    series: {
		        lines: { show: true },
		        points: { show: true }
		    },
		    legend: {
			    show: true,
			    backgroundColor: null,
			    backgroundOpacity: 0
			},
			grid: {
				color: "rgba(255, 255, 255, 0.5)"
			},
			xaxis: {
				tickColor: "rgba(255, 255, 255, 0.5)",
				mode: "time",
				timeformat: "%Y",
				minTickSize: [1, "year"]
			},
			yaxis: {
				tickColor: "rgba(255, 255, 255, 0.5)"
			}
		};
		
		$.each(data, function(key, value) {
			$.each(value.subjects, function(key2, value2) {
				var dataLine = {};
				var line = [];

				$.each(value2.vals_numeric, function(key3, value3) {
					var d = new Date("01/12/"+parseInt(key3.toString().slice(0, 4)));
					var point = [d.getTime(), value3];
					line.push(point);
				});	
				
				dataLine["label"] = value.param_name+"<br/> <i>"+value2.subject_name+"</i>";
				dataLine["data"] = line;

				lines.push(dataLine);
			});
		});

		$.plot(this.elements["GRAPH"], lines, options);
	}

	this.getBeginData = function() {
		return this.ageSelectorGraphStartWidget.selectedYear;
	}

	this.getEndData = function() {
		return this.ageSelectorGraphEndWidget.selectedYear;
	}
}