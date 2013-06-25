var HalladdView = Backbone.View.extend({
  className: 'halladd',
  events: {
    "click #hallAdd": "onHallAdd"
  },

  initialize: function () {
    this.template = $('#halladd-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
   
    return this;
  },

  onHallAdd: function() {
    var params = {};
    params.title = $("#add_hall_title").val();
    params.text = $("#add_hall_text").val();
    params.fio = $("#add_hall_fio").val();
    
    $.post('/api/hall/create', params, function(data) {
      
    })
  }
});

var HallListView = Backbone.View.extend({
  className: 'halllist',

  initialize: function () {
    this.hallList = new HallList();
    this.hallList.fetch();

    this.template = $('#halllist-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { halls: this.hallList.toJSON() } ));
    
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