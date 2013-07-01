var NewsView = Backbone.View.extend({
  className: 'news',
  newsnav: null,
  newsblue: null,
  newsadmin: null,

  initialize: function () {
    this.template = $('#news-template').html();
    this.newsnav = new NewsnavView();
    this.newsblue = new NewsblueView();
    this.newsadmin = new NewsadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.newsnav.el);
    this.newsnav.setElement(this.$(".newsnav-widget")).render();

    $(this.el).append(this.newsblue.el);
    this.newsblue.setElement(this.$(".newsblue-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.newsadmin.el);
      this.newsadmin.setElement(this.$(".newsadmin-widget")).render();
    }
   
    return this;
  },
});

var NewsaddView = Backbone.View.extend({
  className: 'newsadd',
  events: {
    "click #newsAdd": "onNewsAdd",
    "click #newsAddCancel": "onNewsAddCancel"
  },
  newsnav: null,
  newsadmin: null,

  initialize: function () {
    this.template = $('#newsadd-template').html();

    this.newsnav = new NewsnavView();
    this.newsadmin = new NewsadminView();
    this.newsnavSelect = new NewsnavSelectView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.newsnavSelect.el);
    this.newsnav.setElement(this.$(".newsnav-widget")).render();

    $(this.el).append(this.newsnavSelect.el);
    this.newsnavSelect.setElement(this.$(".newsnavselect-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.newsadmin.el);
      this.newsadmin.setElement(this.$(".newsadmin-widget")).render();
    }
   
    return this;
  },

  onNewsAdd: function() {
  },
  onNewsAddCancel: function() {
    window.location.hash = '#!/news';
  }
});

var NewsnavaddView = Backbone.View.extend({
  className: 'newsnavadd',
  events: {
    "click #newsnavAdd": "onNewsnavAdd",
    "click #newsnavAddCancel": "onNewsnavAddCancel"
  },
  newsnav: null,
  newsadmin: null,

  initialize: function () {
    this.template = $('#newsnavadd-template').html();

    this.newsnav = new NewsnavView();
    this.newsadmin = new NewsadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.newsnav.el);
    this.newsnav.setElement(this.$(".newsnav-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.newsadmin.el);
      this.newsadmin.setElement(this.$(".newsadmin-widget")).render();
    }
   
    return this;
  },

  onNewsnavAdd: function() {
    var params = {};
    params.title = $("#add_news_title").val();

    $.post('/api/newsnav/create', params, function(data) {
      window.location.hash = '#!/news';
    })
  },
  onNewsnavAddCancel: function() {
    window.location.hash = '#!/news';
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
    "click #newsnav-list a": "onNewsNavClick",
    "click .deleteNewsnav": "onDeleteNewsnav"
  },

  initialize: function () {
    _.bindAll(this,"onNewsNavClick", "render");
    this.newsnavList = new NewsnavList();
    this.newsnavList.fetch();

    this.template = $('#newsnav-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { newsnav: this.newsnavList.toJSON(), user: window.user } ));
    
    return this;
  },

  onNewsNavClick: function(e) {
    var id = $(e.target).attr("data-id");
    window.location.hash = '#!/news';

    $(".news_list article").slideDown();

    if(id != 0) {
      $(".news_list article[data-newsnavid!='"+id+"']").slideUp();
    }
  },

  onDeleteNewsnav: function(e) {
    var self = this;
    $.get(
      "/api/newsnav/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var NewsnavSelectView = Backbone.View.extend({
  className: 'newsnavselect',

  initialize: function () {
    this.newsnavList = new NewsnavList();
    this.newsnavList.fetch();

    this.template = $('#newsnavselect-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { newsnav: this.newsnavList.toJSON() } ));
    
    return this;
  },
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
  events: {
    "click .deleteNews": "onDeleteNews"
  },

  initialize: function () {
    this.newsList = new NewsList();
    this.newsList.fetch();

    this.template = $('#newsbox-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { news: this.newsList.toJSON(), user: window.user } ));
    
    return this;
  },

  onDeleteNews: function(e) {
    var self = this;
    $.get(
      "/api/news/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var NewsadminView = Backbone.View.extend({
  className: 'newsadmin',

  initialize: function () {
    this.template = $('#newsadmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, {} ));
    
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