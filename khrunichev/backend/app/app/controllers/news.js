var News = function () {

  this.list = function(req, resp, params) {
    var user = geddy.model.News.create({
      title: "title",
      shortText: "shortText",
      text: "text"
    });
    console.log(user);
    user.save(function(err, data) {
      console.log(err);
    });
    this.respondsWith = ['json', 'js'];
    this.respond({params: params});
  };

};

exports.News = News;

