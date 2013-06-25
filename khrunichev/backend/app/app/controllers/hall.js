var Hall = function () {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	
  this.list = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 
    
    geddy.model.Hall.all(function(err, halls) {
      self.respond({halls: halls});
    });
    
  };

  this.create = function (req, resp, params) {
    this.respondsWith = ['json', 'js'];
    var self = this
      , hall = geddy.model.Hall.create(params);

    if (!hall.isValid()) {
      params.errors = hall.errors;
      self.transfer('add');
    }

    hall.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.respond({status: "ok"});
      }
    });
  };

};

exports.Hall = Hall;
