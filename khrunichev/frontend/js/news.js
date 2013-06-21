var NewsView = Backbone.View.extend({
  className: 'news',

  initialize: function () {
    this.template = $('#news-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});