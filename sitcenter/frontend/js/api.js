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

		$.each(this.parametrs, function(key, value) {
			$.each(value.parameters, function(key2, value2) {
				if(value2 && value2.id == id) {
					par = value2;
				}
			});
		});

		return par;
	}

	this.parametrsNameClick_ = function(evt) {
		if(!$(evt.target).hasClass("active")) {
			var self = this;
			$(this.CSS["SCROLL"]).find(".active").removeClass("active");
			$(evt.target).toggleClass("active");

			this.setTitle($(evt.target).html());
			this.currentParametr = this.getParametrById($(evt.target).parent().parent().attr("data-id"));
			this.app.mapColorel.colored(
				this.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge
			);
			this.app.mapColorWidget.updateParams();

			this.app.paramsManager.getParamUom(this.currentParametr.id, function(data) {
				self.elements["UOM"].html(data.responseText);
			});
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
		this.scrollApi = this.elements["SCROLL"].data('jsp');
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
			this.legendWidget.show();
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
		$(this.CSS["SCROLL"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["SCROLL"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		var elems = $(this.CSS["SCROLL"]).find("ul");
		$.each(elems, function(key, value) {
			if($(value).find("li ul li:not(.hidde)").size() == 0) {
				$(value).addClass("hidde");
			}
		})
		
	}

	this.getParamsByRegionAndYeage = function(region_id) {
		this.app.paramsManager.getParamsByRegionAndYeage(region_id, this.app.ageSelectorWidget.selectedAge, $.proxy(this.getParametrs_, this));
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
			if(key == 0 && data["red"]) {
				$(value).html("нет<br /> данных");
			}
			if(key == 1 && data["red"]) {
				$(value).html(parseInt(data["red"][0])+"-"+parseInt(data["red"][1]));
			}
			if(key == 2 && data["yellow"]) {
				$(value).html(parseInt(data["yellow"][0])+"-"+parseInt(data["yellow"][1]));
			}
			if(key == 3 && data["green"]) {
				$(value).html(parseInt(data["green"][0])+"-"+parseInt(data["green"][1]));
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

	this.getAll = function(callback) {
		$.get(this.app.apiHost + "/subjects.json", callback);
	}
}

/**
 * [LegendManager description]
 * @param {[type]} app [description]
 */
var LegendManager = function(app) {
	this.app = app;
	this.ajaxPath = "/param_levels/";

	this.getLegendByParamAndSubject = function(param_id, subject_id, callback) {
		$.get(this.app.apiHost + this.ajaxPath + param_id + "/" + subject_id, callback);
	}
}


/**
 * [ParamsManager description]
 * @param {[type]} app [description]
 */
var ParamsManager = function(app) {
	this.app = app;
	this.ajaxPath = "/groups/";

	this.getParamsByRegionAndYeage = function(region_id, yeage, callback) {
		$.get(this.app.apiHost + this.ajaxPath + region_id+ "/" + yeage , callback);
	}

	this.getRegionStateByParamsAndYeage = function(region_id, yeage, callback) {
		$.get(this.app.apiHost + "/parameters/" + region_id + "/" + yeage , callback);
	}

	this.getParamValues = function(param_id, subject_id, year, callback) {
		$.get(this.app.apiHost + "/param_vals/" + param_id + "/" + subject_id + "/" + year, callback);
	}

	this.getParamUom = function(param_id, callback) {
		$.ajax(this.app.apiHost + "/parameter_uom/" + param_id).always(callback);
	}

	this.getParamsByRegionAndAge = function(regions, age, callback) {
		$.ajax(
			{
				url: this.app.apiHost + "/parameter_names/",
				type: "POST",
				dataType: 'JSON',
				data: {
					"subject_ids": regions,
					"year": age
				},
				success: callback
			}
		);
	}
}

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
		if(this.state) {
			this.app.paramsManager.getParamValues(
				this.app.parametrsWidgets.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedAge,
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


	this.colored = function(params_id, region_id, year) {
		var mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+region_id+"/"+year+"/map";

		$(this.CSS["LOAD"]).addClass("onShow");

		if(this.isShowed) {
			this.elements["CONTAINER"].removeClass("onShow");
		}
		$.ajax({ url: mapPath }).always($.proxy(this.onGetMapLink_, this));
	}

	this.onGetMapLink_ = function(data) {
		var link = data.responseText;
		var self = this;
		var image = new Image();

        image.src = self.app.apiHost+link;

        image.onload = function() {
        	self.elements["CONTAINER"].css("backgroundImage", "url('"+self.app.apiHost+link+"')");
			self.elements["CONTAINER"].addClass("onShow");
			$(self.CSS["LOAD"]).removeClass("onShow");
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

	this.findInCompare_ = function(region_id) {
		var ret = null;

		$.each(this.regionCompare, function(key, value) {
			if(value == region_id) {
				ret = key;
			}
		});
		return ret;
	}
}

/**
 * [AgeSelectorWidget description]
 * @param {[type]} app [description]
 */
var AgeSelectorWidget = function(app) {
	this.app = app;
	this.ages = [2012, 2011, 2010, 2009, 2008]
	this.selectedAge = 2012;
	this.CSS = {
		"SELECTOR": "#age_select"
	}

	this.elements = {
		"SELECTOR": $(this.CSS["SELECTOR"])
	}

	this.draw = function() {
		var self = this;
		self.elements["SELECTOR"].html("");
		$.each(this.ages, function(key, value) {
			var selected = "";
			if(value == self.currentAge) {
				selected = 'selected="selected"';
			}
			var html = '<option '+selected+' value="'+value+'">'+value+'</option>';
			self.elements["SELECTOR"].append(html);
		});
		this.elements["SELECTOR"].selectbox({
			effect: "slide",
			onChange: $.proxy(this.ageSelected_, this)
		});
	}

	this.ageSelected_ = function(val, inst) {
		this.selectedAge = val;
		var self = this;
		this.app.paramsManager.getParamsByRegionAndYeage(this.app.currentRegion, val, $.proxy(this.app.parametrsWidgets.getParametrs_, this.app.parametrsWidgets));
		if(this.app.parametrsWidgets.currentParametr) {
			this.app.mapColorel.colored(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge
			);
			this.app.mapColorWidget.updateParams();
			this.app.legendManager.getLegendByParamAndSubject(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion,
				function(data) {
					self.app.legendWidget.setLevelText(data);
					self.app.legendWidget.show();
				}
			);
		}
	}
}

/**
 * [AgeSelectorWidget description]
 * @param {[type]} app [description]
 */
var AgeSelectorFormatWidget = function(app) {
	this.app = app;
	this.ages = [2012, 2011, 2010, 2009, 2008]
	this.selectedAge = 2012;
	this.CSS = {
		"SELECTOR": "#params-age-selected"
	}

	this.elements = {
		"SELECTOR": $(this.CSS["SELECTOR"])
	}

	this.draw = function() {
		var self = this;
		self.elements["SELECTOR"].html("");
		$.each(this.ages, function(key, value) {
			var selected = "";
			if(value == self.currentAge) {
				selected = 'selected="selected"';
			}
			var html = '<option '+selected+' value="'+value+'">'+value+'</option>';
			self.elements["SELECTOR"].append(html);
		});
		this.elements["SELECTOR"].selectbox({
			effect: "slide",
			onChange: $.proxy(this.ageSelected_, this)
		});
	}

	this.ageSelected_ = function(val, inst) {
		this.selectedAge = val;
		var self = this;
		this.app.paramsManager.getParamsByRegionAndYeage(this.app.currentRegion, val, $.proxy(this.app.parametrsWidgets.getParametrs_, this.app.parametrsWidgets));
		if(this.app.parametrsWidgets.currentParametr) {
			this.app.mapColorel.colored(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion, 
				this.app.ageSelectorWidget.selectedAge
			);
			this.app.mapColorWidget.updateParams();
			this.app.legendManager.getLegendByParamAndSubject(
				this.app.parametrsWidgets.currentParametr.id, 
				this.app.currentRegion,
				function(data) {
					self.app.legendWidget.setLevelText(data);
					self.app.legendWidget.show();
				}
			);
		}
	}
}

/**
 * [FooterNavWidget description]
 * @param {[type]} app [description]
 */
var FooterNavWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#footer-nav-widget"
	};
	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	};
	this.items = {
		"MAP": {
			"title": "Карта"
		},
		"FORMAT": {
			"title": "Формат"
		},
		"GRAPH": {
			"title": "График",
			"cooming": true
		},
		"EVENTS": {
			"title": "События",
			"cooming": true
		}
	}

	this.draw_ = function() {
		$.each(this.items, $.proxy(this.drawItem_, this));
	}
	this.drawItem_ = function(index, element) {
		var newElement = $('<a>'+element["title"]+'</a>');
		newElement.attr("data-id", index);
		if(element["cooming"]) {
			newElement.addClass("cooming");
		}
		if(index == "MAP") {
			newElement.addClass("active");
		}
		this.elements["MAIN"].append(newElement);
	}
	this.addEvents_ = function() {
		$(this.CSS["MAIN"]).find("a").on("click", $.proxy(this.onItemClick_, this));
	}
	this.onItemClick_ = function(evt) {
		var curElement = $(evt.target);
		var itemId = curElement.attr("data-id");
		
		if(itemId == "FORMAT") {
			this.app.mapStateManager.addBlur();
			this.app.mapStateManager.miniMapWriter.opacityHidden();
			this.app.mapColorel.hidden();
			this.app.mapStateManager.SVGWriter.hide();
			this.app.parametrsWidgets.fullHidden();
			this.app.legendWidget.hide();
			this.app.regionsSelectorWidget.show();
			this.app.paramsSelectorWidget.show();
		}

		if(itemId == "MAP") {
			this.app.mapStateManager.removeBlur();
			if(this.app.currentZoom != 1) {
				this.app.mapStateManager.miniMapWriter.opacityShow();	
			}
			this.app.mapColorel.show();
			this.app.mapStateManager.SVGWriter.show();
			this.app.parametrsWidgets.fullShow();
			this.app.regionsSelectorWidget.hidden();
			this.app.paramsSelectorWidget.hidden();

			if(this.app.parametrsWidgets.currentParametr) {
				this.app.legendWidget.show();	
			}
		}

		if(!curElement.hasClass("cooming") || !curElement.hasClass("active")) {
			$(this.CSS["MAIN"]).find("a").removeClass("active");
			curElement.toggleClass("active");	
		}
	}

	this.draw_();
	this.addEvents_();
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
		"DATA-PLACE": "#region-data-place"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"])
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
			this.app.ageSelectorFormatWidget.selectedAge,
			function() {
				
			}
		);

		this.app.paramsSelectorWidget.updateParams(this.getCurrentIds(), this.app.ageSelectorFormatWidget.selectedAge);
			
		$(this.CSS["DATA-PLACE"]+ " li a").on("click", $.proxy(this.onRegionClick_, this));
		$(this.CSS["DATA-PLACE"]+ " li span").on("click", $.proxy(this.onRegionNameClick_, this));
		
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
		"DATA-PLACE": "#params-data-place"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"])
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
	}

	this.onParamNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
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
	this.CSS = {
		"MAIN": "#format-data"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}
}