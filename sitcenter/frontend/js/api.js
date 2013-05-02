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
		"FILTER": "#params-filter"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"]),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"])
	}

	this.animateStep = "-400px";
	this.animateSpeed = 1000;
	this.legendWidget = new LegendWidget(this.app);
	this.scrollApi = null;
	this.currentParametr = null;

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
		this.setTitle($(evt.target).html());
		this.currentParametr = this.getParametrById($(evt.target).parent().parent().attr("data-id"));
	}

	this.setTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.getParametrs_ = function(data) {
		this.parametrs = data;

		this.clearParametrs_();
		this.drawParamets_(this.parametrs);
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

	this.clearParametrs_ = function() {
	}

	this.drawParamets_ = function(params) {
		var html = "";

		$.each(params, function(key, value) {
			html += "<ul><li>";
			html += "<a class='group'>"+value.short_name+"</a>";
			if(value.parameters.length > 0) {
				html += "<ul>";
				$.each(value.parameters, function(key2, value2) {
					if(value2) {
						html += "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param'><em class='spr'>-</em> <em class='name'>"+value2.short_name+"</em></span></li>";
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
		if(!this.scrollApi) {
			this.initScroll_();
		}
		this.scrollApi.reinitialise();
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

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));

		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" li", $.proxy(this.parametrsClick_, this));
		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" .name", $.proxy(this.parametrsNameClick_, this));
	}

	this.bindEvents_();
	this.app.groupsManager.getAll($.proxy(this.getParametrs_, this));
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
 * [GroupsManager description]
 * @param {[type]} app [description]
 */
var GroupsManager = function(app) {
	this.app = app;
	this.ajaxPath = "/groups.json";

	this.getAll = function(callback) {
		$.get(this.app.apiHost + this.ajaxPath, callback);
	}
}