var StrView = Backbone.View.extend({
  className: 'str',
  strnav: null,
  strbox: null,

  initialize: function () {
    this.template = $('#str-template').html();
    this.strnav = new StrnavView();
    this.strbox = new StrboxView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.strnav.el);
  	this.strnav.setElement(this.$(".strnav-widget")).render();

  	$(this.el).append(this.strbox.el);
  	this.strbox.setElement(this.$(".strbox-widget")).render();
    
    return this;
  }
});

var StrnavView = Backbone.View.extend({
  className: 'strnav',

  initialize: function () {
    this.template = $('#strnav-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var StrboxView = Backbone.View.extend({
  className: 'strbox',

  initialize: function () {
    this.template = $('#strbox-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});