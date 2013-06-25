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
    var self = this
      , newspaper = geddy.model.Newspaper.create(params);
    
    newspaper.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.respond({status: "ok"});
      }
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
