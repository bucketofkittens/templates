var Questnav = function () {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	
  this.list = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 
    
    geddy.model.Questnav.all(function(err, questnav) {
      self.respond({questnav: questnav});
    });
    
  };

  this.one = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    geddy.model.Questnav.first({id: params.id}, function(err, questnav) {
      newsnav.getNews(function (err, questnav) {
        questnav.quest = quest;
        self.respond({newsnav: questnav});
      });
    }); 
    
  };

  this.create = function (req, resp, params) {
    this.respondsWith = ['json', 'js'];
    var self = this
      , questnav = geddy.model.Questnav.create(params);

    if (!questnav.isValid()) {
      params.errors = questnav.errors;
      self.transfer('add');
    }

    questnav.save(function(err, data) {
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

    geddy.model.Questnav.remove(params.id, function(err) {
      if (err) {
        self.respond({status: "fail"});
      } else {
        self.respond({status: "ok"});
      }
    });
  };
};

exports.Questnav = Questnav;
