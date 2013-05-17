var ConfigApp = {
	"PATHES": {
		"VIDEO": "/static/video/",
		"SVG": "/static/svg/",
		"MAP": "/static/images/map/",
		"MINI-MAP": "/static/images/mini/"
	},
	"API-HOST": "http://54.224.205.171:3000"
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