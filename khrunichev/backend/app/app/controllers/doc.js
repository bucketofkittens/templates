var formidable = require('formidable')
  , fs = require('fs')
  , path = require('path')
  , utils = require('utils');

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

    geddy.model.News.first(params.id, function(err, news) {
      news.updateProperties(params);
      if (!news.isValid()) {
        params.errors = news.errors;
        self.transfer('edit');
      }

      news.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
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
          var doc = geddy.model.Doc.create(fields);
          doc.save(function(err, data) {
            if (err) {
              params.errors = err;
              self.transfer('add');
            } else {
              console.log({text: params.comment, docId: doc.id});
              var docnode = geddy.model.Docnode.create({text: fields.comment, docId: doc.id});
              docnode.save(function(err, data) {
                self.redirect("/index.html#!/structure/document/added");
              });
            }
          });
        });
      });
    });

    /*
    form.addListener('end', function () {
      params.file = uploadedFile;
      var doc = geddy.model.Doc.create(params);
      doc.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('add');
        } else {
          var docnode = geddy.model.Docnode.create({text: params.comment, docId: doc.id});
          docnode.save(function(err, data) {
            self.respond({status: "ok"});
          });
        }
      });
    });
  */
    

    
  };
  
  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.News.all(function(err, news) {
    console.log(news);
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
