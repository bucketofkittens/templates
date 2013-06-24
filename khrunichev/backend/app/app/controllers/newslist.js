var Newslist = function () {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	
  this.list = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js']; 
    
    geddy.model.Newslist.all(function(err, newslist) {
      self.respond({newslist: newslist});
    });
    
  };

  this.one = function(req, resp, params) {
    var self = this;
    this.respondsWith = ['json', 'js'];

    geddy.model.Newslist.first({id: params.id}, function(err, newslist) {
      newslist.getNews(function (err, news) {
        newslist.news = news;
        self.respond({newslist: newslist});
      });
      
    }); 
    
  };
};

exports.Newslist = Newslist;
