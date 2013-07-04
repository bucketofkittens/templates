var SuperView = Backbone.View.extend({
  className: 'super',

  initialize: function () {
    this.template = $('#super-template').html();
    this.login = new LoginView();
    this.sup = new SuperSubView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    if(window.user.id) {
      $(this.el).append(this.sup.el);
      this.sup.setElement(this.$(".sup-widget")).render();
    } else {
      $(this.el).append(this.login.el);
      this.login.setElement(this.$(".login-widget")).render();
    }

    return this;
  }
});

var SuperSubView = Backbone.View.extend({
  className: 'supersub',

  initialize: function () {
    this.template = $('#supersub-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    return this;
  },
});

