var oracle = require("oracle");
var Iconv  = require('iconv').Iconv;

var Sdi = function () {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	
  this.groups = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "SCAdmin", "password": "masterkey", "database": "XE", "encoding":"windows-1251" };

    oracle.connect(connectData, function(err, connection) {
      // selecting rows
      connection.execute("SELECT * FROM SYS.RDM_GROUPS", [], function(err, results) {
        results.forEach(function(value, key) {
          var iconv = new Iconv('UTF-8', 'CP1251');
          console.log(results[key]["NAME"]);
          results[key]["NAME"] = iconv.convert(results[key]["NAME"]).toString("utf-8");
        });
        connection.close();
        self.respond({"results": results});
      });
    });
  }

  this.groupsIn = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "SCAdmin", "password": "masterkey", "database": "XE" };

    oracle.connect(connectData, function(err, connection) {
      connection.execute("SELECT GUID, NAMESCREEN, IMAGE FROM RDM_REFERENCE WHERE (FGUID='"+params.id+"')", [], function(err, results) {
        connection.close();
        self.respond({"results": results});
      });
    });
  };

  this.tree = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "SCAdmin", "password": "masterkey", "database": "XE" };

    console.log("SELECT ro.guid, ro.fguid, ro.displayname, ro.classid FROM sys.rdm_objects ro WHERE (ro.fguid is null)and(ro.classid='"+params.id+"') ");
    oracle.connect(connectData, function(err, connection) {
      connection.execute("SELECT ro.guid, ro.fguid, ro.displayname, ro.classid FROM rdm_objects ro WHERE (ro.fguid is null)and(ro.classid='"+params.id+"') ", [], function(err, results) {

        self.respond({"results": results});
        connection.close();
      });
    });
  };

  this.tree2 = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "SCAdmin", "password": "masterkey", "database": "XE" };

    console.log("SELECT ro.guid, ro.fguid, ro.displayname, ro.classid FROM rdm_objects ro WHERE (ro.fguid='"+params.id+"') ");
    oracle.connect(connectData, function(err, connection) {
      connection.execute("SELECT ro.guid, ro.fguid, ro.displayname, ro.classid FROM rdm_objects ro WHERE (ro.fguid='"+params.id+"') ", [], function(err, results) {

        self.respond({"results": results});
        connection.close();
      });
    });
  };

  this.content = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    var connectData = { "hostname": "localhost", "user": "SCAdmin", "password": "masterkey", "database": "XE" };
    var parm = "";
    
    oracle.connect(connectData, function(err, connection) {
      connection.execute("SELECT ra.ID, ra.NAMEATTR, ra.NAMESCREEN||DECODE(ral.GUID_MUNIT,NULL,' ', ' ('||(SELECT RM2.OBOZN  FROM RDM_MEASURE2 rm2 WHERE GUID=ral.GUID_MUNIT)||')') as NAMESCREEN, RA.TYPEDATA, RA.ARRAYMDATA FROM RDM_ATTRS ra, RDM_ATTRS_LINK ral WHERE (ral.namegroup='"+params.id+"')and(ral.idtypeattr=ra.id)", [], function(err, results) {
        results.forEach(function(value, key) {
          parm += value["ID"]+";";
        });
        connection.execute("select rr.refname||'.'||rc.classname from rdm_classes rc, rdm_reference rr where (rc.guidparent='"+params.className+"')and(rc.fguid=rr.guid)", [], function(err2, results2) {

          connection.execute("call RDM_REQUEST_FORPORTAL('"+results2[0]["RR.REFNAME||\'.\'||RC.CLASSNAME"]+"','"+params.id+"','','"+parm+"',1)", [], function(err3, results3) {
           
              connection.execute("SELECT RESULT1 FROM TEMP_RESULT", [], function(err4, results4) {
                connection.execute(results4[0]["RESULT1"], [], function(err4, results5) {
                  connection.close();
                  self.respond({results: {"cols": results, rows: results5}});
               });
             });
          });
        });

        
      });
    });
    //connection.close();
  };

};

exports.Sdi = Sdi;

/*
ALTER TABLE 
   TEMP_RESULT 
MODIFY 
   ( 
   RESULT1 VARCHAR2(2256) 
   )
;
select * from all_source where name = 'RDM_REQUEST_FORPORTAL';
call RDM_REQUEST_FORPORTAL('RI.TYPESIZE','BpEe0sOraoprgWHGQ0SFlc','','548;586;588;632;656;657;688;705;884;6569;',1);

SELECT
    DATA_TYPE 
FROM
    all_tab_columns 
WHERE
    upper(table_name) = 'TEMP_RESULT' AND upper(column_name) = 'RESULT1';

    SELECT table_name, column_name, data_type, data_length
FROM USER_TAB_COLUMNS
WHERE table_name = 'TEMP_RESULT';

CREATE TABLE TEMP_RESULT (
      ID  NUMBER
    , RESULT CLOB
);

select TEXT from all_source where name = 'RDM_REQUEST_FORPORTAL';
*/