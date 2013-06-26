var Auth = function () {
	this.authenticate = function (req, resp, params) {
        this.respondsWith = ['json', 'js'];
        var self = this;

        geddy.model.User.first({ "email": params.email }, null, function(err, user) {
            if(!user || err || user.password !== params.password) {
                self.respond({status: "fail"});
            } else {
                self.respond({status: "ok", user: user});
                self.session.set('authenticated', user);
            }
        });
    };
    this.authenticateClient = function (req, resp, params) {
        this.respondsWith = ['json', 'js'];
        var self = this;

        geddy.model.Client.first({ "email": params.email }, null, function(err, user) {
            if(!user || err || user.password !== params.password) {
                self.respond({status: "fail"});
            } else {
                self.respond({status: "ok", user: user});
                self.session.set('authenticatedClient', user);
            }
        });
    };

    this.status = function (req, resp, params) {
        this.respondsWith = ['json', 'js'];
        var self = this;

        if(self.session.get("authenticated")) {
            self.respond({status: "ok", user: self.session.get("authenticated")});
        } else {
            self.respond({status: "fail"});
        }
    };
    this.statusClient = function (req, resp, params) {
        this.respondsWith = ['json', 'js'];
        var self = this;

        if(self.session.get("authenticatedClient")) {
            self.respond({status: "ok", user: self.session.get("authenticatedClient")});
        } else {
            self.respond({status: "fail"});
        }
    };
    this.logout = function (req, resp, params) {
        this.respondsWith = ['json', 'js'];
        this.session.set("authenticated", false);
        this.respond({status: "ok"});
    };

    this.logoutClient = function (req, resp, params) {
        this.respondsWith = ['json', 'js'];
        this.session.set("authenticatedClient", false);
        this.respond({status: "ok"});
    };
};

exports.Auth = Auth;
