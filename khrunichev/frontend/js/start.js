var StartView = Backbone.View.extend({
  className: 'start',

  initialize: function () {
    this.template = $('#start-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});