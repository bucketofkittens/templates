var gpsMdl = function(){
	var R = 937.7;
	var self = {};
	var radian = Math.PI/180;
	
	self.setCoord = function(latitude, longitude){
		self.latitude = latitude;
		self.longitude = longitude;
	};

	self.D = function(){
		return {
			x: R * Math.sin((90 - self.longitude)*radian) * Math.cos((-90 + self.latitude)*radian),
			y: R * Math.sin((90 - self.longitude)*radian) * Math.sin((-90 + self.latitude)*radian),
			z: R * Math.cos((90 - self.longitude)*radian)
		};
	};

	self.thePos = function(matrix3){
		var vector = self.D();
		var thePos = {};
		thePos.x = matrix3[0][0]*vector.x + matrix3[1][0]*vector.y + matrix3[2][0]*vector.z + matrix3[3][0];		
		thePos.y = matrix3[0][1]*vector.x + matrix3[1][1]*vector.y + matrix3[2][1]*vector.z + matrix3[3][1];
		thePos.z = matrix3[0][2]*vector.x + matrix3[1][2]*vector.y + matrix3[2][2]*vector.z + matrix3[3][2];
		return thePos;
	};

	self.screen_coords = function(thePos, screen_origin, aspect){
		var screen_coords = {};
		screen_coords.x = Math.floor(aspect * (thePos.x - screen_origin.x));
		screen_coords.y = Math.floor(-(aspect * (thePos.y - screen_origin.y)));
		return screen_coords;
	};

	return self;
}();


