var SearchView = Backbone.View.extend({
  className: 'search',

  initialize: function () {
    this.template = $('#search-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});