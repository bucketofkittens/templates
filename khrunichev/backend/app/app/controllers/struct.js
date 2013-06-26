var Struct = function () {
	this.list = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 
    
    geddy.model.Struct.all(function(err, structs) {
      self.respond({structs: structs});
    });
    
  };

  this.create = function (req, resp, params) {
    this.respondsWith = ['json', 'js'];
    var self = this
      , str = geddy.model.Struct.create(params);

    if (!str.isValid()) {
      params.errors = str.errors;
      self.transfer('add');
    }

    str.save(function(err, data) {
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

    geddy.model.Struct.remove(params.id, function(err) {
      if (err) {
        self.respond({status: "fail"});
      } else {
        self.respond({status: "ok"});
      }
    });
  };

};

exports.Struct = Struct;
