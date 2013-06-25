var EventaddView = Backbone.View.extend({
  className: 'eventadd',
  events: {
    "click #eventAdd": "onEventAdd",
    "click #eventAddCancel": "onEventAddCancel"
  },

  initialize: function () {
    this.template = $('#eventadd-template').html();

    this.startnag = new StartnagView();
    this.eventadmin = new EventadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.startnag.el);
    this.startnag.setElement(this.$(".startnag-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.eventadmin.el);
      this.eventadmin.setElement(this.$(".eventadmin-widget")).render();
    }
   
    return this;
  },

  onEventAdd: function() {
    var params = {};
    params.title = $("#add_event_title").val();
    params.text = CKEDITOR.instances["add_event_text"].getData();
    $.post('/api/event/create', params, function(data) {
      window.location.hash = '#!/event';
    })
  },

  onEventAddCancel: function() {
    window.location.hash = '#!/event';
  }
});

var EventListView = Backbone.View.extend({
  className: 'eventlist',
  events: {
    "click .deleteEvent": "onDeleteEvent"
  },

  initialize: function () {
    this.eventList = new EventList();
    this.eventList.fetch();

    this.template = $('#eventlist-template').html();

    this.startnag = new StartnagView();
    this.eventadmin = new EventadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { events: this.eventList.toJSON(), user: user } ));

    $(this.el).append(this.startnag.el);
    this.startnag.setElement(this.$(".startnag-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.eventadmin.el);
      this.eventadmin.setElement(this.$(".eventadmin-widget")).render();
    }
    
    return this;
  },

  onDeleteEvent: function(e) {
    var self = this;
    $.get(
      "/api/event/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var EventadminView = Backbone.View.extend({
  className: 'eventadmin',

  initialize: function () {
    this.template = $('#eventadmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, {} ));
    
    return this;
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