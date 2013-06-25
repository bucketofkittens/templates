var HalladdView = Backbone.View.extend({
  className: 'halladd',
  events: {
    "click #hallAdd": "onHallAdd",
    "click #hallAddCancel": "onHallAddCancel"
  },

  initialize: function () {
    this.template = $('#halladd-template').html();

    this.startnag = new StartnagView();
    this.halladmin = new HalladminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.startnag.el);
    this.startnag.setElement(this.$(".startnag-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.halladmin.el);
      this.halladmin.setElement(this.$(".halladmin-widget")).render();
    }
   
    return this;
  },

  onHallAdd: function() {
    var params = {};
    params.title = $("#add_hall_title").val();
    params.text = CKEDITOR.instances["add_hall_text"].getData();
    params.fio = $("#add_hall_fio").val();
    
    $.post('/api/hall/create', params, function(data) {
      window.location.hash = '#!/hall';
    })
  },

  onHallAddCancel: function() {
    window.location.hash = '#!/hall';
  }
});

var HallListView = Backbone.View.extend({
  className: 'halllist',
  events: {
    "click .deleteHall": "onDeleteHall"
  },

  initialize: function () {
    this.hallList = new HallList();
    this.hallList.fetch();

    this.template = $('#halllist-template').html();

    this.startnag = new StartnagView();
    this.halladmin = new HalladminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { halls: this.hallList.toJSON(), user: window.user } ));

    $(this.el).append(this.startnag.el);
    this.startnag.setElement(this.$(".startnag-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.halladmin.el);
      this.halladmin.setElement(this.$(".halladmin-widget")).render();
    }
    
    return this;
  },

  onDeleteHall: function(e) {
    var self = this;
    $.get(
      "/api/hall/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var HalladminView = Backbone.View.extend({
  className: 'halladmin',

  initialize: function () {
    this.template = $('#halladmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, {} ));
    
    return this;
  }
});

var HallModel = Backbone.Model.extend();

var HallList = Backbone.Collection.extend({
   model: HallModel,
   url: '/api/hall',
   parse: function(response, xhr) {
      return response.halls;
   }
});