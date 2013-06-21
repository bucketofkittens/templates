var VopotvView = Backbone.View.extend({
  className: 'vopotv',

  initialize: function () {
    this.template = $('#vopotv-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});