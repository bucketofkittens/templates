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
		var cor = 57.924;

		gps.x = latitude;
		gps.y = longitude;
		console.log(gps);
		ret["x"] = 5.81936*(945.6*Math.sin((90-gps.x)/cor)*Math.cos((-90+gps.y)/cor)*(0.779855)+945.6*Math.sin((90-gps.x)/cor)*Math.sin((-90+gps.y)/cor)*(0.62596)+945.6*Math.cos((90-gps.x)/cor)*(0.0)+(0.000244141)-(-164.967));
		ret["y"] = -5.81936*(945.6*Math.sin((90-gps.x)/cor)*Math.cos((-90+gps.y)/cor)*(-0.203262)+945.6*Math.sin((90-gps.x)/cor)*Math.sin((-90+gps.y)/cor)*(0.253235)+945.6*Math.cos((90-gps.x)/cor)*(0.94581)+(-543.082)-(92.7937));
		console.log(ret);
		return ret;
	}
}