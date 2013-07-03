var formidable = require('formidable')
  , fs = require('fs')
  , path = require('path')
  , utils = require('utils');

var $ = require('jquery');

var Doc = function () {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	
  this.list = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 
    
    geddy.model.Doc.all(function(err, docs) {
      self.respond({docs: docs});
    });
  };

  this.one = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    geddy.model.News.first(function(err, news) {
        self.respond({news: news});
    }); 
    
  };
  
  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.News.first(params.id, function(err, news) {
      if (!news) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, news: news});
      }
    });
  };
  
  this.update = function (req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 

    geddy.model.Doc.first(params.id, function(err, doc) {
      doc.updateProperties(params);

      doc.save(function(err, data) {
        self.respond({"status": "ok"});
      });
    });
  };
  
  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    this.respondsWith = ['json', 'js'];
    var self = this; 
    var form = new formidable.IncomingForm()
      , uploadedFile
      , savedFile;

    form.parse(req,function(err,fields,files) {
      fs.readFile(files['filename'].path, function (err, data) {
        var newPath = path.join('public', 'upload', files['filename'].name);
        fs.writeFile(newPath, data, function (err) {
          fields.file = files['filename'].name;
          fields.status = 0;
          var doc = geddy.model.Doc.create(fields);
          doc.save(function(err, data) {
            self.redirect("/index.html#!/structure/document/added");
          });
        });
      });
    });

  };

  this.update2 = function (req, resp, params) {
    this.respondsWith = ['json', 'js'];
    var self = this; 
    var form = new formidable.IncomingForm()
      , uploadedFile
      , savedFile;

    form.parse(req,function(err,fields,files) {
      geddy.model.Doc.first(params.id, function(err, doc) {
        var newPath = path.join('public', 'upload', files['filename'].name);
        fs.writeFile(newPath, data, function (err) {
          
          fields.file = files['filename'].name;
          fields.status = 0;

          params.status = 0;
          params.file = files['filename'].name;
          doc.updateProperties(params);
          console.log(params);
          doc.save(function(err, data) {
            self.redirect("/index.html#!/structure/mydoc");
          });
        });
      });
    });

  };
  
  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.News.all(function(err, news) {
      self.respond({params: params, news: news});
    });
  };
  
  this.destroy = function (req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    geddy.model.News.remove(params.id, function(err) {
      if (err) {
        self.respond({status: "fail"});
      } else {
        self.respond({status: "ok"});
      }
    });
  };

};

exports.Doc = Doc;
