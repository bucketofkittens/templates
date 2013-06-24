var VopotvView = Backbone.View.extend({
  className: 'vopotv',
  vootnav: null,
  vootbox: null,

  initialize: function () {
    this.template = $('#vopotv-template').html();
    this.vootnav = new VootnavView();
    this.vootbox = new VootboxView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.vootnav.el);
  	this.vootnav.setElement(this.$(".vootnav-widget")).render();

  	$(this.el).append(this.vootbox.el);
  	this.vootbox.setElement(this.$(".vootbox-widget")).render();
    
    return this;
  },
});

var VootnavView = Backbone.View.extend({
  className: 'vootnav',

  initialize: function () {
    this.template = $('#vootnav-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var VootboxView = Backbone.View.extend({
  className: 'vootbox',

  initialize: function () {
    this.template = $('#vootbox-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});