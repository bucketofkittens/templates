var Controller = Backbone.Router.extend({
    routes: {
        "": "start",
        "!/": "start", 
        "!/news": "news",
        "!/news/add": "newsadd",
        "!/newsnav/add": "newsnavadd",
        "!/news/:id": "newsitem",
        "!/event": "event",
        "!/event/add": "eventadd",
        "!/hall": "hall",
        "!/hall/add": "halladd",
        "!/newspaper": "newspaper",
        "!/newspaper/add": "newspaperadd",
        "!/questions": "questions",
        "!/questions/add": "questionsAdd",
        "!/quest/edit/:id": "questEdit",
        "!/questnav/add": "questnavAdd",
        "!/structure": "structure",
        "!/structure/view/:id": "structureView",
        "!/structure/add": "structureAdd",
        "!/structure/document/:id/:parenId": "document",
        "!/structure/mydoc": "mydoc",
        "!/structure/mydoc/:id": "mydocEdit",
        "!/structure/document/added": "documentAdded",
        "!/doc/edit/:id": "docEdit",
        "!/doc/access/:id": "docAccess",
        "!/search": "search",
        "!/search/group/:id": "searchGroup",
        "!/search/tree/:id": "searchTree",
        "!/login": "login",
        "!/logout": "logout",
        "!/logout/client": "logoutClient",
        "!/super": "sup"
    },

    after: function(route, params) {
        $('#topmenu a').removeClass("current");
        $('#topmenu a[href="#'+route+'"]').addClass("current");
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
    newsnavadd: function() {
       var newsnavAdd = new NewsnavaddView();
       $('#content').slideUp(function() {
            $('#content').html(newsnavAdd.render().el);
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
            CKEDITOR.replace('add_event_text', {
              width: "700px"
            });
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
            CKEDITOR.replace('add_hall_text', {
              width: "700px"
            });
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
            CKEDITOR.replace('text', {
              width: "700px"
            });
        });
    },
    questions: function() {
       var vopotv = new VopotvView();
       $('#content').slideUp(function() {
            $('#content').html(vopotv.render().el);
            $('#content').slideDown();
        });
    },
    questEdit: function(id) {
      var vEdit = new VeditView({id: id});
      $('#content').slideUp(function() {
          $('#content').html(vEdit.render().el);
          $('#content').slideDown();
      });
    },
    docEdit: function(id) {
      var docEdit = new DocEditView({id: id});
      $('#content').slideUp(function() {
          $('#content').html(docEdit.render().el);
          $('#content').slideDown();
      });
    },
    docAccess: function(id) {
      var docAccess = new DocAccessView({id: id});
      $('#content').slideUp(function() {
          $('#content').html(docAccess.render().el);
          $('#content').slideDown();
      });
    },
    questionsAdd: function() {
       var vopotvAdd = new VopotvAddView();
       $('#content').slideUp(function() {
            $('#content').html(vopotvAdd.render().el);
            $('#content').slideDown();
        });
    },
    questnavAdd: function() {
       var questnavAdd = new QuestnavAddView();
       $('#content').slideUp(function() {
            $('#content').html(questnavAdd.render().el);
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
    structureView: function(id) {
       var strV = new StrVView({id: id});
       $('#content').slideUp(function() {
            $('#content').html(strV.render().el);
            $('#content').slideDown();
        });
    },
    structureAdd: function() {
       var strAdd = new StrAddView();
       console.log(strAdd);
       $('#content').slideUp(function() {
            $('#content').html(strAdd.render().el);
            $('#content').slideDown();
        });
    },
    document: function(id, parentId) {
      var doc = new DocView({id: id, parentId: parentId});
       $('#content').slideUp(function() {
            $('#content').html(doc.render().el);
            $('#content').slideDown();
        });
    },
    mydoc: function() {
      var myDoc = new MyDocView();
       $('#content').slideUp(function() {
            $('#content').html(myDoc.render().el);
            $('#content').slideDown();
        });
    },
    mydocEdit: function(id) {
      var myDocEdit = new MyDocEditView({id: id});
       $('#content').slideUp(function() {
            $('#content').html(myDocEdit.render().el);
            $('#content').slideDown();
        });
    },
    documentAdded: function() {
      var docAdd = new DocAddedView();
       $('#content').slideUp(function() {
            $('#content').html(docAdd.render().el);
            $('#content').slideDown();
        });
    },
    search: function() {
       var search = new SearchFolderView();
       $('#content').slideUp(function() {
            $('#content').html(search.render().el);
            $('#content').slideDown();
        });
    },
    searchGroup: function(id) {
      var search = new SearchInView({id: id});
       $('#content').slideUp(function() {
            $('#content').html(search.render().el);
            $('#content').slideDown();
        });
    },
    searchTree: function(id) {
      var search = new SearchView({id: id});
       $('#content').slideUp(function() {
            $('#content').html(search.render().el);
            $('#content').slideDown();
        });
     },
    logout: function() {
      $.ajax(
        "/api/auth/logout",
        function(data) {
          window.user = {};
          window.location.hash = '#!/';
          window.location.reload();
          globalEvents.trigger('logouting', {});
        }
      );

      window.location.hash = '#!/';
      window.location.reload();
      
    },
    logoutClient: function() {
      $.ajax(
        "/api/auth/client/logout",
        function(data) {
          console.log("logout");
          window.clientUser = {};
          window.location.hash = '#!/structure';
          window.location.reload();
        }
      );
      window.location.hash = '#!/structure';
      window.location.reload();
    },
    sup: function() {
        var sup = new SuperView();
     $('#content').slideUp(function() {
          $('#content').html(sup.render().el);
          $('#content').slideDown();
      });
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
    if(window.user.roleId != 10) {
      $(".hall-item").show();
      $(".event-item").show();  
    }
  },

  onLogouting: function() {
    $(".exit-item").hide();
    $(".hall-item").hide();
    $(".event-item").hide();
    $(".enter-item").show();
  }
});

var globalEvents = {};
_.extend(globalEvents, Backbone.Events);
window.user = {};
window.clientUser = {};

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

  $.get(
    "/api/auth/client/status",
    function(data) {
      if(data.status == "ok") {
        window.clientUser = data.user;
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