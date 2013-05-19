var ConfigApp = {
	"PATHES": {
		"VIDEO": "/static/video/",
		"SVG": "/static/svg/",
		"MAP": "/static/images/map/",
		"MINI-MAP": "/static/images/mini/"
	},
	"API-HOST": "http://54.224.205.171:3000",
	"REGIONS": {
		"LEFT": {
			"MAP": "/static/images/map/all-regions-left.png",
			"VIDEO": {
				"IN": "/static/video/all-regions-left-forward.mp4",
				"OUT": "/static/video/all-regions-left-rewind.mp4"
			},
			"SVG": "/static/svg/all_regions_borders_left.svg"
		},
		"CENTER": {
			"MAP": "/static/images/map/all-regions-center.png",
			"SVG": "/static/svg/all_regions_borders_center.svg"
		},
		"RIGHT": {
			"MAP": "/static/images/map/all-regions-right.png",
			"VIDEO": {
				"IN": "/static/video/all-regions-right-forward.mp4",
				"OUT": "/static/video/all-regions-right-rewind.mp4"
			},
			"SVG": "/static/svg/all_regions_borders_right.svg"
		}
	}
}

/**
 * [ConfigManager description]
 * @param {[type]} app    [description]
 * @param {[type]} config [description]
 */
var ConfigManager = function(app, config) {
	this.app = app;
	this.config = config;

	this.getMapById = function(id_region) {
		return this.config["PATHES"]["MAP"]+id_region+".png";
	}

	this.getMiniMapById = function(id_region) {
		return this.config["PATHES"]["MINI-MAP"]+id_region+".gif";
	}

	this.getSvgById = function(id_region) {
		return this.config["PATHES"]["SVG"]+id_region+".svg";
	}

	this.getInVideoById = function(id_region) {
		return this.config["PATHES"]["VIDEO"]+id_region+"-in.mp4";
	}

	this.getOutVideoById = function(id_region) {
		return this.config["PATHES"]["VIDEO"]+id_region+"-out.mp4";
	}
}