var VopotvView = Backbone.View.extend({
  className: 'vopotv',
  vootnav: null,
  vootbox: null,

  initialize: function () {
    this.template = $('#vopotv-template').html();
    this.vootnav = new VootnavView();
    this.vootbox = new VootboxView();
    this.vopotvadmin = new VopotvadminView();
    this.st = new VopotStView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.vootnav.el);
  	this.vootnav.setElement(this.$(".vootnav-widget")).render();

  	$(this.el).append(this.vootbox.el);
  	this.vootbox.setElement(this.$(".vootbox-widget")).render();

    $(this.el).append(this.st.el);
    this.st.setElement(this.$(".vopotvst-widget")).render();

    if(window.user) {
      $(this.el).append(this.vopotvadmin.el);
      this.vopotvadmin.setElement(this.$(".vopotvadmin-widget")).render();  
    }
    
    return this;
  },
});

var VopotvAddView = Backbone.View.extend({
  className: 'vopotvadd',

  initialize: function () {
    this.template = $('#vopotvadd-template').html();
    this.vootnav = new VootnavView();
    this.vootaddf = new VootaddfView();
    this.vopotvadmin = new VopotvadminView();
    this.st = new VopotStView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.vootnav.el);
    this.vootnav.setElement(this.$(".vootnav-widget")).render();

    $(this.el).append(this.vootaddf.el);
    this.vootaddf.setElement(this.$(".vopotvaddf-widget")).render();

    $(this.el).append(this.st.el);
    this.st.setElement(this.$(".vopotvst-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.vopotvadmin.el);
      this.vopotvadmin.setElement(this.$(".vopotvadmin-widget")).render();  
    }
    
    return this;
  },
});

var QuestnavAddView = Backbone.View.extend({
  className: 'questnavadd',
  events: {
    "click #questnavAdd": "onQuestnavAdd",
    "click #questnavAddCancel": "onQuestnavAddCancel"
  },

  initialize: function () {
    this.template = $('#questnavadd-template').html();
    this.vootnav = new VootnavView();
    this.questnavAddf = new QuestnavAddfView();
    this.vopotvadmin = new VopotvadminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.vootnav.el);
    this.vootnav.setElement(this.$(".vootnav-widget")).render();

    $(this.el).append(this.questnavAddf.el);
    this.questnavAddf.setElement(this.$(".questnavaddf-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.vopotvadmin.el);
      this.vopotvadmin.setElement(this.$(".vopotvadmin-widget")).render();  
    }
    
    return this;
  },
  onQuestnavAdd: function() {
    var params = {};
    params.title = $("#add_questnav_title").val();

    $.post('/api/questnav/create', params, function(data) {
      window.location.hash = '#!/questions';
    })
  },
  onQuestnavAddCancel: function() {
    window.location.hash = '#!/questions';
  }
});

var QuestnavAddfView = Backbone.View.extend({
  className: 'questnavaddf',

  initialize: function () {
    this.template = $('#questnavaddf-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});


var VootaddfView = Backbone.View.extend({
  className: 'vopotvaddf',
  events: {
    "click #addQuest", "onAddQuest"
  },

  initialize: function () {
    this.template = $('#vopotvaddf-template').html();
    this.navSelect = new VopotNavSelectView();
    this.pred1 = new Pred1SelectView();
    this.pred2 = new Pred2SelectView();
    this.pred3 = new Pred3SelectView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.navSelect.el);
    this.navSelect.setElement(this.$(".navselect-widget")).render();

    $(this.el).append(this.pred1.el);
    this.pred1.setElement(this.$(".pred1-widget")).render();

    $(this.el).append(this.pred2.el);
    this.pred2.setElement(this.$(".pred2-widget")).render();

    $(this.el).append(this.pred3.el);
    this.pred3.setElement(this.$(".pred3-widget")).render();
    
    return this;
  },
});

var VopotvadminView = Backbone.View.extend({
  className: 'vopotvadmin',

  initialize: function () {
    this.template = $('#vopotvadmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },
});

var VopotStView = Backbone.View.extend({
  className: 'vopotvst',
  events: {
    "click .deleteQuestnav": "onDeleteQuestnav"
  },

  initialize: function () {
    this.template = $('#vopotvst-template').html();

    this.questnavModel = new QuestnavList();
    this.questnavModel.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { questnav: this.questnavModel.toJSON(), user: window.user }));
    
    return this;
  },

  onDeleteQuestnav: function(e) {
    var self = this;
    $.get(
      "/api/questnav/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});


var VopotNavSelectView = Backbone.View.extend({
  className: 'questnavselect',

  initialize: function () {
    this.template = $('#questnavselect-template').html();

    this.questnavModel = new QuestnavList();
    this.questnavModel.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { questnav: this.questnavModel.toJSON() }));
    
    return this;
  },

  onDeleteQuestnav: function(e) {
    var self = this;
    $.get(
      "/api/questnav/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var Pred1SelectView = Backbone.View.extend({
  className: 'pred1',

  initialize: function () {
    this.template = $('#pred1-template').html();

    this.strList = new StrList();
    this.strList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { structs: this.strList.toJSON() }));
    
    return this;
  },

  onDeleteQuestnav: function(e) {
    var self = this;
    $.get(
      "/api/questnav/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var Pred2SelectView = Backbone.View.extend({
  className: 'pred2',

  initialize: function () {
    this.template = $('#pred2-template').html();

    this.strList = new StrList();
    this.strList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { structs: this.strList.toJSON() }));
    
    return this;
  },

  onDeleteQuestnav: function(e) {
    var self = this;
    $.get(
      "/api/questnav/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var Pred3SelectView = Backbone.View.extend({
  className: 'pred3',

  initialize: function () {
    this.template = $('#pred3-template').html();

    this.strList = new StrList();
    this.strList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { structs: this.strList.toJSON() }));
    
    return this;
  },

  onDeleteQuestnav: function(e) {
    var self = this;
    $.get(
      "/api/questnav/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});


var VootnavView = Backbone.View.extend({
  className: 'vootnav',

  initialize: function () {
    this.template = $('#vootnav-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});



var VootboxView = Backbone.View.extend({
  className: 'vootbox',

  initialize: function () {
    this.template = $('#vootbox-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var QuestnavModel = Backbone.Model.extend();

var QuestnavList = Backbone.Collection.extend({
   model: QuestnavModel,
   url: '/api/questnav',
   parse: function(response, xhr) {
      return response.questnav;
  }
});