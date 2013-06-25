var NewsView = Backbone.View.extend({
  className: 'news',
  newsnav: null,
  newsblue: null,

  initialize: function () {
    this.template = $('#news-template').html();
    this.newsnav = new NewsnavView();
    this.newsblue = new NewsblueView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.newsnav.el);
    this.newsnav.setElement(this.$(".newsnav-widget")).render();

    $(this.el).append(this.newsblue.el);
    this.newsblue.setElement(this.$(".newsblue-widget")).render();
   
    return this;
  },
});

var NewsaddView = Backbone.View.extend({
  className: 'newsadd',
  events: {
    "click #newsAdd": "onNewsAdd"
  },

  initialize: function () {
    this.template = $('#newsadd-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
   
    return this;
  },

  onNewsAdd: function() {
    var params = {};
    params.title = $("#add_news_title").val();
    params.anonce = $("#add_news_anonce").val();
    params.text = $("#add_news_text").val();

    $.post('/api/news/create', params, function(data) {
      console.log(data);
    })
  }
});

var NewsitemView = Backbone.View.extend({
  className: 'newsitem',
  events: {
    "click #newsitem .back": "onBackClick"
  },

  initialize: function (opt) {
    _.bindAll(this,"onBackClick", "render");
    this.newsnav = new NewsnavView();
    this.newsitemList = new NewsitemList({}, {id: opt.id});
    this.newsitemList.fetch();

    this.template = $('#newsitem-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { newsItem: this.newsitemList.toJSON() } ));

    $(this.el).append(this.newsnav.el);
    this.newsnav.setElement(this.$(".newsnav-widget")).render();

    
   
    return this;
  },

  onBackClick: function(e) {
    window.history.back();
  }
});

var NewsnavView = Backbone.View.extend({
  className: 'newsnav',
  events: {
    "click #newsnav-list a": "onNewsNavClick"
  },

  initialize: function () {
    _.bindAll(this,"onNewsNavClick", "render");
    this.newsnavList = new NewsnavList();
    this.newsnavList.fetch();

    this.template = $('#newsnav-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { newsnav: this.newsnavList.toJSON() } ));
    
    return this;
  },

  onNewsNavClick: function(e) {
    var id = $(e.target).attr("data-id");
    window.location.hash = '#!/news';

    $(".news_list article").slideDown();

    if(id != 0) {
      $(".news_list article[data-newsnavid!='"+id+"']").slideUp();
    }
  }
});

var NewsblueView = Backbone.View.extend({
  className: 'newsblue',
  newsbox: null,
  pgn: null,

  initialize: function () {
    this.template = $('#newsblue-template').html();
    this.newsbox = new NewsboxView();
    this.pgn = new PgnView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.pgn.el);
    this.pgn.setElement(this.$(".pgn1-widget")).render();

    $(this.el).append(this.newsbox.el);
    this.newsbox.setElement(this.$(".newsbox-widget")).render();

    this.pgn.setElement(this.$(".pgn2-widget")).render();
    
    return this;
  }
});

var NewsboxView = Backbone.View.extend({
  className: 'newsbox',
  newsnav_id: null,

  initialize: function () {
    this.newsList = new NewsList();
    this.newsList.fetch();

    this.template = $('#newsbox-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { news: this.newsList.toJSON() } ));
    
    return this;
  }
});

var PgnView = Backbone.View.extend({
  className: 'pgn',

  initialize: function () {
    this.template = $('#pgn-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var NewsModel = Backbone.Model.extend();

var NewsList = Backbone.Collection.extend({
   model: NewsModel,
   url: '/api/news',
   parse: function(response, xhr) {
      return response.news;
   }
});

var NewsnavModel = Backbone.Model.extend();

var NewsnavList = Backbone.Collection.extend({
   model: NewsnavModel,
   url: '/api/newsnav',
   parse: function(response, xhr) {
      return response.newsnav;
  }
});

var NewsitemModel = Backbone.Model.extend();

var NewsitemList = Backbone.Collection.extend({
   model: NewsitemModel,
   initialize: function(models, options) {
    this.id = options.id;
    this.url = '/api/news/'+this.id;
   },
   url: '/api/news/'+this.id,
   parse: function(response, xhr) {
      return response.news;
  }
});