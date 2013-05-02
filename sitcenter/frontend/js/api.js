/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var ParametrsWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.filteredParametrs = {};
	this.CSS = {
		"SHOW": "#paramers-show",
		"MAIN": "#parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": ".hidden",
		"PARAMETRS-LIST": "#parametrs-list",
		"TITLE": "#content .data h3",
		"FILTER": "#params-filter",
		"AGE-SELECT": "#age_select"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"]),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"])
	}

	this.animateStep = "-400px";
	this.animateSpeed = 1000;
	this.legendWidget = new LegendWidget(this.app);
	this.scrollApi = null;
	this.currentParametr = null;
	this.currentAge = 2012;

	this.parametrsClick_ = function(evt) {
		$(evt.target).next().slideToggle("slow");
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
		$(this.CSS["SCROLL"]).find(".active").removeClass("active");
		$(evt.target).toggleClass("active");
		this.setTitle($(evt.target).html());
		this.currentParametr = this.getParametrById($(evt.target).parent().parent().attr("data-id"));
		if(this.app.mapColorWidget.state) {
			this.app.mapColorel.colored();
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
		this.parametrs = this.prepareParamerts_(data);

		this.clearParametrs_();
		this.drawParamets_(this.parametrs);
	}

	this.initScroll_ = function() {
		/*$(this.CSS["PARAMETRS-LIST"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["SCROLL"].data('jsp');
		*/
	}

	this.clearParametrs_ = function() {
	}

	this.drawParamets_ = function(params) {
		var html = "";

		$.each(params, function(key, value) {
			html += "<ul class='first'><li>";
			html += "<a class='group'>"+value.name+"</a>";
			if(value.parameters.length > 0) {
				html += "<ul>";
				$.each(value.parameters, function(key2, value2) {
					if(value2) {
						html += "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param'><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><i>"+value2.value+"</i></li>";
					}
				});
				html += "</ul>";	
			}
			html += "</li></ul>";
		});
		if(this.scrollApi) {
			this.scrollApi.destroy();
		}
		$(this.CSS["SCROLL"]).html(html);
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
		/*if(!this.scrollApi) {
			this.initScroll_();
		}
		this.scrollApi.reinitialise();
		*/
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
			if(elem.indexOf(filterValue) == -1) {
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
		this.app.paramsManager.getParamsByRegionAndYeage(region_id, $(this.CSS["AGE-SELECT"]+" :selected").html(), $.proxy(this.getParametrs_, this));
	}

	this.ageSelected_ = function(val, inst) {
		this.currentAge = val;
		this.app.paramsManager.getParamsByRegionAndYeage(this.app.currentRegion, val, $.proxy(this.getParametrs_, this));
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));

		this.elements["AGE-SELECT"].selectbox({
			effect: "slide",
			onChange: $.proxy(this.ageSelected_, this)
		});

		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" li", $.proxy(this.parametrsClick_, this));
		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" .name", $.proxy(this.parametrsNameClick_, this));
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

	this.onToggle_ = function() {
		if(this.state == false) {
			this.elements["TOGGLE"].html("скрыть значения");
			this.state = true;
			this.app.mapColorel.colored();
		} else {
			this.elements["TOGGLE"].html("показать значения");
			this.state = false;
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
	this.mapData = {};
	this.regionCompare = {};
	this.colors = [
		"#c70000",
		"#b98100",
		"#009a33"
	];

	this.setRegionCompare = function(data) {
		this.regionCompare = data;
	}

	this.colored = function() {
		this.app.paramsManager.getRegionStateByParamsAndYeage(
			this.app.parametrsWidgets.currentParametr.id, 
			this.app.parametrsWidgets.currentAge,
			$.proxy(this.onColoredDataRead_, this)
		);
	}

	this.onColoredDataRead_ = function(data) {
		this.mapData = data;

		var self = this;
		var svgWriter = this.app.zoomStateManager.getStateModel().SVGWriter;

		$.each(this.mapData, function(key, value) {
			console.log(value.subject_id);
			var inSvgIndex = self.findInCompare_(value.subject_id);
			console.log(inSvgIndex);
			if(value.subject_id == 102) {
				console.log("WOW: "+value.subject_id+" "+inSvgIndex);
			}
			if(inSvgIndex) {
				var color = "";
				if(value.val_numeric < 8) {
					color = self.colors[0];
				}
				if(value.val_numeric > 8 && value.val_numeric < 15) {
					color = self.colors[1];
				}
				if(value.val_numeric > 15) {
					color = self.colors[2];
				}
				console.log(value.val_numeric);
				svgWriter.coloredPath(inSvgIndex, color);	
			}
		})
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