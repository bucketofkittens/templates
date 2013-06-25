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
        "!/login": "login"
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
    }
});


var controller = new Controller();

Backbone.history.start();

$(document).ready(function() {
    $("body").on("click", "#left ul li a", function(e) {
        $(e.target).parents("ul").find("a").removeClass("current");
        $(e.target).addClass("current");
    });
});