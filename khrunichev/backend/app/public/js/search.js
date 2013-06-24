var SearchView = Backbone.View.extend({
  className: 'search',
  seanav: null,
  seabox: null,

  initialize: function () {
    this.template = $('#search-template').html();
    this.seanav = new SeanavView();
    this.seabox = new SeaboxView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.seanav.el);
  	this.seanav.setElement(this.$(".seanav-widget")).render();

  	$(this.el).append(this.seabox.el);
  	this.seabox.setElement(this.$(".seabox-widget")).render();
    
    return this;
  },
});

var SeanavView = Backbone.View.extend({
  className: 'seanav',

  initialize: function () {
    this.template = $('#seanav-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var SeaboxView = Backbone.View.extend({
  className: 'seabox',

  initialize: function () {
    this.template = $('#seabox-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});