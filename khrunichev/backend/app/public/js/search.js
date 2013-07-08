var SearchView = Backbone.View.extend({
  className: 'search',

  initialize: function (opt) {
    this.template = $('#search-template').html();
    this.seanav = new SeanavView(opt);
    this.seabox = new SeaboxView(opt);
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
  events: {
    "click .inc": "onCurrent"
  },

  initialize: function (opt) {
    this.template = $('#seanav-template').html();

    this.tree = new SearchTreeList();
    this.tree.fetch({data: {id: opt.id}, type: 'POST'});
  },

  render: function () {
    $(this.el).html(_.template(this.template, { tree: this.tree.toJSON() }));
    
    return this;
  },

  onCurrent: function(e) {
    var self = this;
    var tree = new SearchTreeInList();
    var inView = new SeanavInView({collection : tree});
    
    tree.fetch({
      data: {id:$(e.target).attr("data-id")}, 
      type: 'POST',
      success : function(collection) {
        $(e.target).parent().find(".plus").removeClass("plus").addClass("minus");
        $(e.target).parent().find(".append").css("display", "none").html(inView.render().el);
        $(e.target).parent().find(".append").slideDown();
      }
    });

    var content = new SearchContentList();
    var contentView = new SeaContentView({collection : content});
    
    content.fetch({
      data: {className: $(e.target).attr("data-class"), id: $(e.target).attr("data-id")}, 
      type: 'POST',
      success : function(collection) {
        $("#seacontent").css("display", "none").html(contentView.render().el);
        $("#seacontent").slideDown();
      }
    });
  }
});

var SeanavInView = Backbone.View.extend({
  className: 'seanav',
  events: {
    "click .in": "onCurrent"
  },

  initialize: function (opt) {
    this.template = $('#seanavin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { tree: this.collection.toJSON() }));
    
    return this;
  },

  onCurrent: function(e) {
    console.log(e);
  }
});

var SeaContentView = Backbone.View.extend({
  className: 'seacontent',

  initialize: function (opt) {
    this.template = $('#seacontent-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { tree: this.collection.toJSON() }));
    
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

var SearchFolderView = Backbone.View.extend({
  className: 'superfolder',

  initialize: function () {
    this.template = $('#superfolder-template').html();

    this.superFolderModel = new SearchFolderList();
    this.superFolderModel.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { groups: this.superFolderModel.toJSON() } ));
    
    return this;
  }
});

var SearchInView = Backbone.View.extend({
  className: 'superin',

  initialize: function (opt) {
    this.template = $('#superin-template').html();

    this.superFolderModel = new SearchFolderInList();
    this.superFolderModel.fetch({data: {id: opt.id}, type: 'POST'});
  },

  render: function () {
    $(this.el).html(_.template(this.template, { groups: this.superFolderModel.toJSON() } ));
    
    return this;
  }
});




var SearchFolderModel = Backbone.Model.extend();

var SearchFolderList = Backbone.Collection.extend({
   model: SearchFolderModel,
   initialize: function(models, options) {
    this.url = '/api/sdi/groups';
   },
   parse: function(response, xhr) {
      return response.results;
  }
});

var SearchFolderInModel = Backbone.Model.extend();

var SearchFolderInList = Backbone.Collection.extend({
   model: SearchFolderInModel,
   initialize: function(models, options) {
   },
   url: '/api/sdi/groups/in/',
   parse: function(response, xhr) {
      return response.results;
  }
});

var SearchTreeModel = Backbone.Model.extend();

var SearchTreeList = Backbone.Collection.extend({
   model: SearchTreeModel,
   initialize: function(models, options) {
   },
   url: '/api/sdi/tree/',
   parse: function(response, xhr) {
      return response.results;
  }
});

var SearchTreeInModel = Backbone.Model.extend();

var SearchTreeInList = Backbone.Collection.extend({
   model: SearchTreeInModel,
   initialize: function(models, options) {
   },
   url: '/api/sdi/tree2/',
   parse: function(response, xhr) {
      return response.results;
  }
});

var SearchContentModel = Backbone.Model.extend();

var SearchContentList = Backbone.Collection.extend({
   model: SearchTreeInModel,
   initialize: function(models, options) {
   },
   url: '/api/sdi/content/',
   parse: function(response, xhr) {
      return response.results;
  }
});