var NewspaperaddView = Backbone.View.extend({
  className: 'newspaperadd',
  events: {
    "click #newspaperAdd": "onNewspaperAdd"
  },

  initialize: function () {
    this.template = $('#newspaperadd-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
   
    return this;
  },

  onNewspaperAdd: function() {
    var params = {};
    params.title = $("#add_newspaper_title").val();
    params.text = $("#add_newspaper_text").val();
    $.post('/api/newspaper/create', params, function(data) {
      
    })
  }
});

var NewspaperListView = Backbone.View.extend({
  className: 'newspaperlist',

  initialize: function () {
    this.newspaperList = new NewspaperList();
    this.newspaperList.fetch();

    this.template = $('#newspaperlist-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { newspapers: this.newspaperList.toJSON() } ));
    
    return this;
  }
});

var NewspaperModel = Backbone.Model.extend();

var NewspaperList = Backbone.Collection.extend({
   model: NewspaperModel,
   url: '/api/newspaper',
   parse: function(response, xhr) {
      return response.newspapers;
   }
});