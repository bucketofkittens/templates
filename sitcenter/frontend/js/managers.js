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

	this.getRegionsParams = function(callback) {
		$.get(this.app.apiHost + "/regions_params/", callback);
	}

	this.getRegionStateByParamsAndYeage = function(region_id, yeage, callback) {
		$.get(this.app.apiHost + "/parameters/" + region_id + "/" + yeage , callback);
	}

	this.getParamValues = function(param_id, subject_id, year, callback) {
		$.get(this.app.apiHost + "/param_vals/" + param_id + "/" + subject_id + "/" + year, callback);
	}

	this.getRegionsParamValues = function(param_id, year, callback) {
		$.get(this.app.apiHost + "/param_values/" + param_id + "/" + year, callback);
	}

	this.getParamUom = function(param_id, callback) {
		$.ajax(this.app.apiHost + "/parameter_uom/" + param_id).always(callback);
	}

	this.getMapByParamAndYear = function(param_id, year, callback) {
		$.get(this.app.apiHost + "/param_values/" + param_id + "/" + year, callback);
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

/**
 * [FormatManager description]
 * @param {[type]} app [description]
 */
var FormatManager = function(app) {
	this.app = app;

	this.getFormat = function(regions_id, params_id, age, callback) {
		$.ajax(
			{
				url: this.app.apiHost + "/formats/",
				type: "POST",
				dataType: 'JSON',
				data: {
					"subject_ids": regions_id,
					"parameter_ids": params_id,
					"year": age
				},
				success: callback
			}
		);
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var GraphManager = function(app) {
	this.app = app;

	this.getGraph = function(subject_ids, parameter_ids, age_start, age_end, callback) {
		$.ajax(
			{
				url: this.app.apiHost + "/charts/",
				type: "POST",
				dataType: 'JSON',
				data: {
					"subject_ids": subject_ids,
					"parameter_ids": parameter_ids,
					"year1": age_start,
					"year2": age_end
				},
				success: callback
			}
		);
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var RegionsManagerLocal = function(app) {
	this.app = app;
	this.regions = null;
	this.callback = null;

	this.getRegions = function(callback) {
		this.callback = callback;

		if(!this.regions) {
			this.getAllRegions_();
		} else {
			this.callback(this.regions);
		}
	}

	this.getAllRegions_ = function(callback) {
		$.get(this.app.apiHost + "/subjects.json", $.proxy(this.onRegionsRequest_, this));
	}

	this.onRegionsRequest_ = function(data) {
		localStorage.setItem('regions', JSON.stringify({data: data}));
		this.setLocalData_();
		this.callback(data);
	}

	this.setLocalData_ = function() {
		var regionsData = JSON.parse(localStorage.getItem('regions'));
		if(regionsData && regionsData.data) {
			this.regions = regionsData.data;	
		}
	}

	this.getRegionsByParent = function(parent_id, data) {
		var ret = [];
		$.each(data, function(key, value) {
			if(value.parent_id == parent_id) {
				ret.push(value);
			}
		});

		return ret;
	}

	this.getRegionById = function(id, data) {
		var ret = null;
		$.each(data, function(key, value) {
			if(value.id == id) {
				ret = value;
			}
		});

		return ret;
	}

	this.setLocalData_();
}