var Quest = function () {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	
  this.list = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 
    
    geddy.model.Quest.all(function(err, quests) {
      self.respond({quests: quests});
    });
    
  };

  this.one = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    geddy.model.Quest.first(function(err, quests) {
        self.respond({news: quests});
    }); 
    
  };
  
  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Quest.first(params.id, function(err, quests) {
      if (!quests) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, quests: quests});
      }
    });
  };
  
  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Quest.first(params.id, function(err, quests) {
      quests.updateProperties(params);
      if (!quests.isValid()) {
        params.errors = quests.errors;
        self.transfer('edit');
      }

      quests.save(function(err, data) {
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
    var self = this
      , quests = geddy.model.Quest.create(params);

    if (!quests.isValid()) {
      params.errors = quests.errors;
      self.transfer('add');
    }

    quests.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.respond({status: "ok"});
      }
    });
  };
  
  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Quest.all(function(err, quests) {
      self.respond({params: params, quests: quests});
    });
  };
  
  this.destroy = function (req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    geddy.model.Quest.remove(params.id, function(err) {
      if (err) {
        self.respond({status: "fail"});
      } else {
        self.respond({status: "ok"});
      }
    });
  };

};

exports.Quest = Quest;
