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

var NewsnavView = Backbone.View.extend({
  className: 'newsnav',

  initialize: function () {
    this.template = $('#newsnav-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
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

    $(this.el).append(this.newsbox.el);
    this.newsbox.setElement(this.$(".newsbox-widget")).render();

    $(this.el).append(this.pgn.el);
    this.pgn.setElement(this.$(".pgn-widget")).render();
    
    return this;
  }
});

var NewsboxView = Backbone.View.extend({
  className: 'newsbox',

  initialize: function () {
    this.newsList = new NewsList();
    this.newsList.fetch();
    this.template = $('#newsbox-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
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

var News = Backbone.Model.extend();

var NewsList = Backbone.Collection.extend({
   model: News,
   url: 'http://localhost:4000/api/news'
});