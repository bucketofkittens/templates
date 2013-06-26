var StrView = Backbone.View.extend({
  className: 'str',

  initialize: function () {
    this.template = $('#str-template').html();
    this.strnav = new StrnavView();
    this.strbox = new StrboxView();
    this.stradmin = new StradminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.strnav.el);
  	this.strnav.setElement(this.$(".strnav-widget")).render();

  	$(this.el).append(this.strbox.el);
  	this.strbox.setElement(this.$(".strbox-widget")).render();

    if(window.user) {
      $(this.el).append(this.stradmin.el);
      this.stradmin.setElement(this.$(".stradmin-widget")).render(); 
    }
    
    return this;
  }
});

var StrAddView = Backbone.View.extend({
  className: 'stradd',
  events: {
    "click #strAddCancel": "onStrAddCancel",
    "click #strAdd": "onStrAdd"
  },

  initialize: function () {
    this.template = $('#stradd-template').html();
    this.strnav = new StrnavView();
    this.strbox = new StrAddFView();
    this.stradmin = new StradminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.strnav.el);
    this.strnav.setElement(this.$(".strnav-widget")).render();

    $(this.el).append(this.strbox.el);
    this.strbox.setElement(this.$(".straddf-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.stradmin.el);
      this.stradmin.setElement(this.$(".stradmin-widget")).render(); 
    }
    
    return this;
  },

  onStrAddCancel: function() {
    window.location.hash = '#!/structure';
  },

  onStrAdd: function() {
    var params = {};
    params.title = $("#add_str_title").val();
    params.leader = $("#add_str_leader").val();
    params.parentId = $("#add_str_parent option:selected").val();
    console.log(params);
    $.post('/api/structure/create', params, function(data) {
       window.location.hash = '#!/structure';
    })
    
  }
});

var StrAddFView = Backbone.View.extend({
  className: 'straddf',

  initialize: function () {
    this.template = $('#straddf-template').html();
    this.treeSelect = new StrTreeSelectView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.treeSelect.el);
    this.treeSelect.setElement(this.$(".strtreeselect-widget")).render();
    
    return this;
  }
});

var StrTreeSelectView = Backbone.View.extend({
  className: 'strtreeselect',

  initialize: function () {
    this.template = $('#strtreeselect-template').html();

    this.strList = new StrList();
    this.strList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { structs: this.strList.toJSON() }));
    
    return this;
  }
});

var StradminView = Backbone.View.extend({
  className: 'stradmin',

  initialize: function () {
    this.template = $('#stradmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
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

var StrModel = Backbone.Model.extend();

var StrList = Backbone.Collection.extend({
   model: StrModel,
   url: '/api/structure/',
   parse: function(response, xhr) {
      return response.structs;
   }
});