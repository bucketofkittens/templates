var Newsnav = function () {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	
  this.list = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 
    
    geddy.model.Newsnav.all(function(err, newsnav) {
      self.respond({newsnav: newsnav});
    });
    
  };

  this.one = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    geddy.model.Newsnav.first({id: params.id}, function(err, newsnav) {
      newsnav.getNews(function (err, news) {
        newsnav.news = news;
        self.respond({newsnav: newsnav});
      });
    }); 
    
  };

  this.create = function (req, resp, params) {
    this.respondsWith = ['json', 'js'];
    var self = this
      , newsnav = geddy.model.Newsnav.create(params);

    if (!newsnav.isValid()) {
      params.errors = newsnav.errors;
      self.transfer('add');
    }

    newsnav.save(function(err, data) {
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

    geddy.model.Newsnav.remove(params.id, function(err) {
      if (err) {
        self.respond({status: "fail"});
      } else {
        self.respond({status: "ok"});
      }
    });
  };
};

exports.Newsnav = Newsnav;
