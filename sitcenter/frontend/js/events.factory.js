/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var EventsFactory = function(app) {
	this.app = app;

	this.getPosition =  function(id_region, latitude, longitude) {
		if(id_region == 101) {
			return this.get101_(latitude, longitude);
		}
	}

	this.get101_ = function(latitude, longitude) {
		var ret = {};
		var gps = {};

		gps.x = latitude;
		gps.y = longitude;
		console.log(gps);
		ret["x"] = 5.81936*(945.6*Math.sin(90-gps.x)*Math.cos(-90+gps.y)*(0.779855)+945.6*Math.sin(90-gps.x)*Math.sin(-90+gps.y)*(0.62596)+945.6*Math.cos(90-gps.x)*(0.0)+(0.000244141)-(-164.967));
		ret["y"] = -5.81936*(945.6*Math.sin(90-gps.x)*Math.cos(-90+gps.y)*(-0.203262)+945.6*Math.sin(90-gps.x)*Math.sin(-90+gps.y)*(0.253235)+945.6*Math.cos(90-gps.x)*(0.94581)+(-543.082)-(92.7937));

		return ret;
	}
}