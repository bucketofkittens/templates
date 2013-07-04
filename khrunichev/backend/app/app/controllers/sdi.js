var oracle = require("oracle");

var Sdi = function () {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	
  this.groups = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "lyykfi", "password": "1234", "database": "XE" };

    oracle.connect(connectData, function(err, connection) {
      // selecting rows
      connection.execute("SELECT * FROM SYS.RDM_GROUPS", [], function(err, results) {
        console.log(results);
        console.log(err);
        self.respond({"results": results});
      });
    });
  };

  this.groupsIn = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "lyykfi", "password": "1234", "database": "XE" };

    oracle.connect(connectData, function(err, connection) {
      console.log("SELECT GUID, NAMESCREEN, IMAGE FROM SYS.RDM_REFERENCE WHERE (FGUID='"+params.id+"')AND(IS_SYSTEM<>1)");
      connection.execute("SELECT * FROM SYS.RDM_REFERENCE WHERE (SYS.FGUID='"+params.id+"')", [], function(err, results) {
        console.log(err);
        self.respond({"results": results});
      });
    });
  };
};

exports.Sdi = Sdi;