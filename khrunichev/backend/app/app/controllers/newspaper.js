var formidable = require('formidable')
  , fs = require('fs')
  , path = require('path')
  , utils = require('utils');
  
var Newspaper = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  
  this.list = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 
    
    geddy.model.Newspaper.all(function(err, newspapers) {
      self.respond({newspapers: newspapers});
    });
    
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
          fields.link = files['filename'].name;
          var newspaper = geddy.model.Newspaper.create(fields);
          newspaper.save(function(err, data) {
            self.redirect("/index.html#!/newspaper");
          });
        });
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    geddy.model.Newspaper.remove(params.id, function(err) {
      if (err) {
        self.respond({status: "fail"});
      } else {
        self.respond({status: "ok"});
      }
    });
  };

};

exports.Newspaper = Newspaper;
