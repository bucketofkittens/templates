var Controller = Backbone.Router.extend({
    routes: {
        "": "start",
        "!/": "start", 
        "!/news": "news",
        "!/news/add": "newsadd",
        "!/news/:id": "newsitem",
        "!/event": "event",
        "!/event/add": "eventadd",
        "!/hall": "hall",
        "!/hall/add": "halladd",
        "!/newspaper": "newspaper",
        "!/newspaper/add": "newspaperadd",
        "!/questions": "questions",
        "!/structure": "structure",
        "!/search": "search",
        "!/login": "login",
        "!/logout": "logout"
    },

    after: function(route, params) {
        $('#topmenu a').removeClass("current");
        $('#topmenu a[href="#'+route+'"]').addClass("current");
    },

    start: function() {
        var start = new StartView();

        $('#content').slideUp(function() {
            $('#content').html(start.render().el);
            $('#content').slideDown();
        });
    },
    news: function() {
       var news = new NewsView();
       $('#content').slideUp(function() {
            $('#content').html(news.render().el);
            $('#content').slideDown();
        });
    },
    login: function() {
       var login = new LoginView();
       $('#content').slideUp(function() {
            $('#content').html(login.render().el);
            $('#content').slideDown();
        });
    },
    newsitem: function(id) {
       var newsItem = new NewsitemView({id: id});
       $('#content').slideUp(function() {
            $('#content').html(newsItem.render().el);
            $('#content').slideDown();
        });
    },
    newsadd: function() {
       var newsAdd = new NewsaddView();
       $('#content').slideUp(function() {
            $('#content').html(newsAdd.render().el);
            CKEDITOR.replace('add_news_anonce', {
              width: "700px"
            });
            CKEDITOR.replace('add_news_text', {
              width: "700px"
            });
            $('#content').slideDown();
        });
    },
    event: function() {
       var eventList = new EventListView();
       $('#content').slideUp(function() {
            $('#content').html(eventList.render().el);
            $('#content').slideDown();
        });
    },
    eventadd: function() {
       var eventAdd = new EventaddView();
       $('#content').slideUp(function() {
            $('#content').html(eventAdd.render().el);
            $('#content').slideDown();
        });
    },
    hall: function() {
       var hall = new HallListView();
       $('#content').slideUp(function() {
            $('#content').html(hall.render().el);
            $('#content').slideDown();
        });
    },
    halladd: function() {
       var hallAdd = new HalladdView();
       $('#content').slideUp(function() {
            $('#content').html(hallAdd.render().el);
            $('#content').slideDown();
        });
    },
    newspaper: function() {
       var newspaperList = new NewspaperListView();
       $('#content').slideUp(function() {
            $('#content').html(newspaperList.render().el);
            $('#content').slideDown();
        });
    },
    newspaperadd: function() {
       var newspaperAdd = new NewspaperaddView();
       $('#content').slideUp(function() {
            $('#content').html(newspaperAdd.render().el);
            $('#content').slideDown();
        });
    },
    questions: function() {
       var vopotv = new VopotvView();
       $('#content').slideUp(function() {
            $('#content').html(vopotv.render().el);
            $('#content').slideDown();
        });
    },
    structure: function() {
       var str = new StrView();
       $('#content').slideUp(function() {
            $('#content').html(str.render().el);
            $('#content').slideDown();
        });
    },
    search: function() {
       var search = new SearchView();
       $('#content').slideUp(function() {
            $('#content').html(search.render().el);
            $('#content').slideDown();
        });
    },
    logout: function() {
      console.log("g");
      $.ajax(
        "/api/auth/logout",
        function(data) {
          window.user = {};
          window.location.hash = '#!/';
          globalEvents.trigger('logouting', {});
        }
      );
      
    }
});

var TopnavView = Backbone.View.extend({
  className: 'topnav',

  initialize: function () {
    this.template = $('#topnav-template').html();
    globalEvents.on('logining', this.onLogining, this);
    globalEvents.on('logouting', this.onLogouting, this);
  },

  render: function () {
    $(this.el).html(_.template(this.template, {}));
    
    return this;
  },

  onLogining: function() {
    $(".enter-item").hide();
    $(".exit-item").show();
  },

  onLogouting: function() {
    $(".exit-item").hide();
    $(".enter-item").show();
  }
});

var globalEvents = {};
_.extend(globalEvents, Backbone.Events);
window.user = {};

var controller = new Controller();

Backbone.history.start();

$(document).ready(function() {
  $.get(
    "/api/auth/status",
    function(data) {
      if(data.status == "ok") {
        window.user = data.user;
        globalEvents.trigger('logining', {});
      }
    }
  );
  var topNav = new TopnavView();
  $('#topnav-widget').html(topNav.render().el);

  $("body").on("click", "#left ul li a", function(e) {
      $(e.target).parents("ul").find("a").removeClass("current");
      $(e.target).addClass("current");
  });
});