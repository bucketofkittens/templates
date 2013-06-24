var NewsView = Backbone.View.extend({
  className: 'news',
  newsnav: null,
  newsbox: null,

  initialize: function () {
    this.template = $('#news-template').html();
    this.newsnav = new NewsnavView();
    this.newsbox = new NewsboxView();
  },

  render: function () {
  	$(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.newsnav.el);
  	this.newsnav.setElement(this.$(".newsnav-widget")).render();

  	$(this.el).append(this.newsbox.el);
  	this.newsbox.setElement(this.$(".newsbox-widget")).render();
   
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

var NewsboxView = Backbone.View.extend({
  className: 'newsbox',

  initialize: function () {
    this.template = $('#newsbox-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});