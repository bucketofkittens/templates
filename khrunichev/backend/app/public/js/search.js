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

  initialize: function (opt) {
    this.template = $('#seanav-template').html();

    this.tree = new SearchTreeList();
    this.tree.fetch({data: {id: opt.id}, type: 'POST'});
  },

  render: function () {
    console.log(this.tree.toJSON());
    $(this.el).html(_.template(this.template, { tree: this.tree.toJSON() }));
    
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