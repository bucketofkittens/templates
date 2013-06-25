var EventaddView = Backbone.View.extend({
  className: 'eventadd',
  events: {
    "click #eventAdd": "onEventAdd"
  },

  initialize: function () {
    this.template = $('#eventadd-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
   
    return this;
  },

  onEventAdd: function() {
    var params = {};
    params.title = $("#add_event_title").val();
    params.text = $("#add_event_text").val();
    console.log(params);
    $.post('/api/event/create', params, function(data) {
      
    })
  }
});

var EventModel = Backbone.Model.extend();

var EventList = Backbone.Collection.extend({
   model: EventModel,
   url: '/api/event',
   parse: function(response, xhr) {
      return response.events;
   }
});