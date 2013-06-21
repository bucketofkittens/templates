var StrView = Backbone.View.extend({
  className: 'str',

  initialize: function () {
    this.template = $('#str-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});