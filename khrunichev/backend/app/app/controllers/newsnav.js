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
};

exports.Newsnav = Newsnav;
