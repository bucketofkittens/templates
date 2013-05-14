var walk    = require('walk');
var files   = [];

// Walker options
var walker  = walk.walk('./', { followLinks: false });

walker.on('file', function(root, stat, next) {
	var path = root + '/' + stat.name;
    files.push(path.replace("./", "/static/"));
    next();
});

walker.on('end', function() {
    fs = require('fs');

    var print = "CACHE MANIFEST \n";

    for(i = 0; i < files.length; i++) {
    	print += files[i]+ "\n";
    }

	print +="NETWORK: \n * \n FALLBACK: \n\n ";

	fs.writeFile('cache.appcache', print, function (err) {
	  if (err) return console.log(err);
	});
});

