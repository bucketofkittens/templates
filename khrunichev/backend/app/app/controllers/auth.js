var Auth = function () {
	this.authenticate = function (req, resp, params) {
        var self = this;

        geddy.model.User.load({ "email": params.email }, null, function(err, user) {
            if(!user || err || user.password !== params.password) {
                params.errors = err;
                //self.transfer('Main.index');
            } else {
                self.session.set('authenticated', true);
                //self.transfer('Main.index'); 
            }
        });
    };
};

exports.Auth = Auth;
