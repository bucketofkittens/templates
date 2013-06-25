var NewspaperaddView = Backbone.View.extend({
  className: 'newspaperadd',
  events: {
    "click #newspaperAdd": "onNewspaperAdd",
    "click #newspaperAddCancel": "onNewspaperAddCancel"
  },

  initialize: function () {
    this.template = $('#newspaperadd-template').html();

    this.startnag = new StartnagView();
    this.newspaperadmin = new NewspaperadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.startnag.el);
    this.startnag.setElement(this.$(".startnag-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.newspaperadmin.el);
      this.newspaperadmin.setElement(this.$(".newspaperadmin-widget")).render();
    }
   
    return this;
  },

  onNewspaperAdd: function() {
    var params = {};
    params.title = $("#add_newspaper_title").val();
    params.text = CKEDITOR.instances["add_newspaper_text"].getData();
    
    $.post('/api/newspaper/create', params, function(data) {
      window.location.hash = '#!/newspaper';
    })
  },

  onNewspaperAddCancel: function() {
    window.location.hash = '#!/newspaper';
  }
});

var NewspaperListView = Backbone.View.extend({
  className: 'newspaperlist',
  events: {
    "click .deleteNewspaper": "onDeleteNewspaper"
  },

  initialize: function () {
    this.newspaperList = new NewspaperList();
    this.newspaperList.fetch();

    this.template = $('#newspaperlist-template').html();

    this.startnag = new StartnagView();
    this.newspaperadmin = new NewspaperadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { newspapers: this.newspaperList.toJSON(), user: user } ));

    $(this.el).append(this.startnag.el);
    this.startnag.setElement(this.$(".startnag-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.newspaperadmin.el);
      this.newspaperadmin.setElement(this.$(".newspaperadmin-widget")).render();
    }
    
    return this;
  },

  onDeleteNewspaper: function(e) {
    var self = this;
    $.get(
      "/api/newspaper/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var NewspaperadminView = Backbone.View.extend({
  className: 'newspaperadmin',

  initialize: function () {
    this.template = $('#newspaperadmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, {} ));
    
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