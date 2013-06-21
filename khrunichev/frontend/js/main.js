var Controller = Backbone.Router.extend({
    routes: {
        "": "start",
        "!/": "start", 
        "!/news": "news",
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