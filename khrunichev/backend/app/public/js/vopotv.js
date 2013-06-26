var VopotvView = Backbone.View.extend({
  className: 'vopotv',
  vootnav: null,
  vootbox: null,

  initialize: function () {
    this.template = $('#vopotv-template').html();
    this.vootnav = new VootnavView();
    this.vootbox = new VootboxView();
    this.vopotvadmin = new VopotvadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.vootnav.el);
  	this.vootnav.setElement(this.$(".vootnav-widget")).render();

  	$(this.el).append(this.vootbox.el);
  	this.vootbox.setElement(this.$(".vootbox-widget")).render();

    if(window.user) {
      $(this.el).append(this.vopotvadmin.el);
      this.vopotvadmin.setElement(this.$(".vopotvadmin-widget")).render();  
    }
    
    return this;
  },
});

var VopotvAddView = Backbone.View.extend({
  className: 'vopotvadd',

  initialize: function () {
    this.template = $('#vopotvadd-template').html();
    this.vootnav = new VootnavView();
    this.vootaddf = new VootaddfView();
    this.vopotvadmin = new VopotvadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.vootnav.el);
    this.vootnav.setElement(this.$(".vootnav-widget")).render();

    $(this.el).append(this.vootaddf.el);
    this.vootaddf.setElement(this.$(".vopotvaddf-widget")).render();

    if(window.user) {
      $(this.el).append(this.vopotvadmin.el);
      this.vopotvadmin.setElement(this.$(".vopotvadmin-widget")).render();  
    }
    
    return this;
  },
});

var QuestnavAddView = Backbone.View.extend({
  className: 'questnavadd',

  initialize: function () {
    this.template = $('#questnavadd-template').html();
    this.vootnav = new VootnavView();
    this.questnavAddf = new QuestnavAddfView();
    this.vopotvadmin = new VopotvadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.vootnav.el);
    this.vootnav.setElement(this.$(".vootnav-widget")).render();

    $(this.el).append(this.questnavAddf.el);
    this.questnavAddf.setElement(this.$(".questnavaddf-widget")).render();

    if(window.user) {
      $(this.el).append(this.vopotvadmin.el);
      this.vopotvadmin.setElement(this.$(".vopotvadmin-widget")).render();  
    }
    
    return this;
  },
});

var QuestnavAddfView = Backbone.View.extend({
  className: 'questnavaddf',

  initialize: function () {
    this.template = $('#questnavaddf-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});


var VootaddfView = Backbone.View.extend({
  className: 'vopotvaddf',

  initialize: function () {
    this.template = $('#vopotvaddf-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});

var VopotvadminView = Backbone.View.extend({
  className: 'vopotvadmin',

  initialize: function () {
    this.template = $('#vopotvadmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
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