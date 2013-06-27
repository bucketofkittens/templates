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

    geddy.model.Quest.first({id: params.id}, function(err, quests) {
        self.respond({quests: quests});
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

    this.respondsWith = ['json', 'js'];

    geddy.model.Quest.first(params.id, function(err, quests) {
      quests.updateProperties(params);
      if (!quests.isValid()) {
        params.errors = quests.errors;
        self.transfer('edit');
      }

      quests.save(function(err, data) {
        if (err) {
          self.respond({status: "fail"});
        } else {
          self.respond({status: "ok"});
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
        var nodemailer = require("nodemailer");
        var smtpTransport = nodemailer.createTransport("SMTP",{
            service: "Gmail",
            auth: {
                user: "lyykfi@gmail.com",
                pass: "gtxfkmyj13"
            }
        });
        var mailOptions = {
            from: "lyykfi@gmail.com",
            to: params.email,
            subject: "Отклик на сайте",
            html: "Добрый день. Вы задали вопрос в разделе вопрос и ответ на сайте. В ближайшее время он будет рассмотрен и отвечен )."
        }

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){

            // if you don't want to use this transport object anymore, uncomment following line
            smtpTransport.close(); // shut down the connection pool, no more messages
        });

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
