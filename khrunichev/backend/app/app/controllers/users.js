var Users = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.list = function (req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 

     geddy.model.User.all(function(err, users) {
      self.respond({users: users});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , user = geddy.model.User.create(params);

    if (!user.isValid()) {
      params.errors = user.errors;
      self.transfer('add');
    }

    user.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (!user) {
        var err = new Error();
        err.statusCode = 404;
        self.error(err);
      } else {
        self.respond({params: params, user: user.toObj()});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (!user) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, user: user});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      user.updateProperties(params);
      if (!user.isValid()) {
        params.errors = user.errors;
        self.transfer('edit');
      }

      user.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.User.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Users = Users;
