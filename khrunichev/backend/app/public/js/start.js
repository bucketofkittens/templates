var StartView = Backbone.View.extend({
  className: 'start',
  startnag: null,
  startser: null,
  startppr: null,
  startnew: null,
  startman: null,
  startann: null,

  initialize: function () {
    this.template = $('#start-template').html();
    this.startnag = new StartnagView();
    this.startser = new StartserView();
    this.startppr = new StartpprView();
    this.startnew = new StartnewView();
    this.startman = new StartmanView();
    this.startann = new StartannView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.startnag.el);
  	this.startnag.setElement(this.$(".startnag-widget")).render();

  	$(this.el).append(this.startser.el);
  	this.startser.setElement(this.$(".startser-widget")).render();

  	$(this.el).append(this.startppr.el);
  	this.startppr.setElement(this.$(".startppr-widget")).render();

  	$(this.el).append(this.startnew.el);
  	this.startnew.setElement(this.$(".startnew-widget")).render();

  	$(this.el).append(this.startman.el);
  	this.startman.setElement(this.$(".startman-widget")).render();

  	$(this.el).append(this.startann.el);
  	this.startann.setElement(this.$(".startann-widget")).render();
    
    return this;
  },
});

var StartnagView = Backbone.View.extend({
  className: 'startnag',

  initialize: function () {
    this.template = $('#startnag-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var StartserView = Backbone.View.extend({
  className: 'startser',

  initialize: function () {
    this.template = $('#startser-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var StartpprView = Backbone.View.extend({
  className: 'startppr',

  initialize: function () {
    this.template = $('#startppr-template').html();

    this.newspaperList = new NewspaperList();
    this.newspaperList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { newspapers: this.newspaperList.toJSON() } ));
    
    return this;
  }
});

var StartnewView = Backbone.View.extend({
  className: 'startnew',

  initialize: function () {
    this.template = $('#startnew-template').html();

    this.newsList = new NewsList();
    this.newsList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { news: this.newsList.toJSON() } ));
    
    return this;
  }
});

var StartmanView = Backbone.View.extend({
  className: 'startman',

  initialize: function () {
    this.template = $('#startman-template').html();

    this.hallList = new HallList();
    this.hallList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { halls: this.hallList.toJSON() } ));
    
    return this;
  }
});

var StartannView = Backbone.View.extend({
  className: 'startann',

  initialize: function () {
    this.template = $('#startann-template').html();

    this.eventList = new EventList();
    this.eventList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { events: this.eventList.toJSON() } ));
    
    return this;
  }
});

var LoginView = Backbone.View.extend({
  className: 'login',
  events: {
    "click #logining": "onLogining"
  },

  initialize: function () {
    this.template = $('#login-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context ));
    
    return this;
  },

  onLogining: function(e) {
    var login = $("#login_login").val();
    var passw = $("#login_passw").val();
    var error = false;
    var self = this;

    $(".error").fadeOut();

    if(login.length == 0) {
      $(".error-login").fadeIn();
      error = true;
    }
    if(passw.length == 0) {
      $(".error-passw").fadeIn();
      error = true;
    }

    if(!error) {
      $.post(
        "/api/auth/login",
        {email: login, password: passw},
        function(data) {
          if(data.status == "ok") {
            window.user = data.user;
            window.location.hash = '#!/';
            globalEvents.trigger('logining', {});
          } else {
            $(".error-not").fadeIn();
          }
        }
      );
    }
  }
});