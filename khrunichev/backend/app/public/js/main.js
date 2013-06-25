var Controller = Backbone.Router.extend({
    routes: {
        "": "start",
        "!/": "start", 
        "!/news": "news",
        "!/news/add": "newsadd",
        "!/news/:id": "newsitem",
        "!/event/add": "eventadd",
        "!/questions": "questions",
        "!/structure": "structure",
        "!/search": "search"
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
    eventadd: function() {
       var eventAdd = new EventaddView();
       $('#content').slideUp(function() {
            $('#content').html(eventAdd.render().el);
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