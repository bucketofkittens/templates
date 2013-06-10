Number.prototype.toRad = function () { return this * Math.PI / 180; }
Number.prototype.toDegrees = function () { return this * (180 / Math.PI); }

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

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
		ret["x"] = 5.81936*(945.6*Math.sin(90-gps.x).toDegrees()*Math.cos(-90+gps.y).toDegrees()*(0.779855)+945.6*Math.sin(90-gps.x).toDegrees()*Math.sin(-90+gps.y).toDegrees()*(0.62596)+945.6*Math.cos(90-gps.x).toDegrees()*(0.0)+(0.000244141)-(-164.967));
		ret["y"] = -5.81936*(945.6*Math.sin(90-gps.x).toDegrees()*Math.cos(-90+gps.y).toDegrees()*(-0.203262)+945.6*Math.sin(90-gps.x).toDegrees()*Math.sin(-90+gps.y).toDegrees()*(0.253235)+945.6*Math.cos(90-gps.x).toDegrees()*(0.94581)+(-543.082)-(92.7937));

		return ret;
	}
}