var ConfigApp = {
	"PATHES": {
		"VIDEO": "/static/video/",
		"SVG": "/static/svg/",
		"MAP": "/static/images/map/",
		"MINI-MAP": "/static/images/mini/"
	},
	"PRELOAD": {
		"IMAGES": [
			"/static/images/map/100.png",
			"/static/images/map/101.png",
			"/static/images/map/52.png"
		],
		"VIDEO": [
			"/static/video/101-in.mp4",
			"/static/video/101-out.mp4",
			"/static/video/102-in.mp4",
			"/static/video/102-out.mp4",
			"/static/video/103-in.mp4",
			"/static/video/103-out.mp4",
			"/static/video/104-in.mp4",
			"/static/video/104-out.mp4",
			"/static/video/105-in.mp4",
			"/static/video/105-out.mp4",
			"/static/video/106-in.mp4",
			"/static/video/106-out.mp4",
			"/static/video/107-in.mp4",
			"/static/video/107-out.mp4",
			"/static/video/108-in.mp4",
			"/static/video/108-out.mp4",
			"/static/video/52-in.mp4",
			"/static/video/52-out.mp4"
		]
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