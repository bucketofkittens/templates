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
        connection.close();
        self.respond({"results": results});
      });
    });
  };

  this.groupsIn = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "lyykfi", "password": "1234", "database": "XE" };

    oracle.connect(connectData, function(err, connection) {
      connection.execute("SELECT FGUID, GUID, NAMESCREEN FROM SYS.RDM_REFERENCE WHERE (FGUID='"+params.id+"')", [], function(err, results) {
        connection.close();
        self.respond({"results": results});
      });
    });
  };

  this.tree = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "lyykfi", "password": "1234", "database": "XE" };

    console.log("SELECT ro.guid, ro.fguid, ro.displayname, ro.classid FROM sys.rdm_objects ro WHERE (ro.fguid is null)and(ro.classid='"+params.id+"') ");
    oracle.connect(connectData, function(err, connection) {
      connection.execute("SELECT ro.guid, ro.fguid, ro.displayname, ro.classid FROM sys.rdm_objects ro WHERE (ro.fguid is null)and(ro.classid='"+params.id+"') ", [], function(err, results) {

        self.respond({"results": results});
        connection.close();
      });
    });
  };

  
};

exports.Sdi = Sdi;