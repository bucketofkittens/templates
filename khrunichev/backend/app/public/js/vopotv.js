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
    this.admin = new VadminView();
    this.valist = new ValistView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.vootnav.el);
  	this.vootnav.setElement(this.$(".vootnav-widget")).render();

    $(this.el).append(this.st.el);
    this.st.setElement(this.$(".vopotvst-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.vopotvadmin.el);
      this.vopotvadmin.setElement(this.$(".vopotvadmin-widget")).render();

      $(this.el).append(this.admin.el);
      this.admin.setElement(this.$(".vadmin-widget")).render();

      $(this.el).append(this.valist.el);
      this.valist.setElement(this.$(".valist-widget")).render();  
    } else {
      $(this.el).append(this.vootbox.el);
      this.vootbox.setElement(this.$(".vootbox-widget")).render();
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
    "click #addQuest": "onAddQuest"
  },

  initialize: function () {
    this.template = $('#vopotvaddf-template').html();
    this.navSelect = new VopotNavSelectView();
    this.pred1 = new Pred1SelectView();
    this.pred2 = new Pred2SelectView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.navSelect.el);
    this.navSelect.setElement(this.$(".navselect-widget")).render();

    $(this.el).append(this.pred1.el);
    this.pred1.setElement(this.$(".pred1-widget")).render();

    $(this.el).append(this.pred2.el);
    this.pred2.setElement(this.$(".pred2-widget")).render();
    
    return this;
  },

  onAddQuest: function(e) {
    var params = {};
    params.questnavId = $("#questnav-select option:selected").val();
    params.parent1Id = $("#pred1-select option:selected").val();
    params.parent2Id = $("#pred2-select option:selected").val();
    params.parent3Id = $("#pred3-select option:selected").val();
    params.title = $("#add_question_title").val();
    params.fio = $("#add_question_fio").val();
    params.email = $("#add_question_email").val();
    params.quest = $("#add_question_quest").val();
    params.status = 0;
    params.pub = 0;

    var error = false;
    $(".error").fadeOut();

    if(params.questnavId == 0 || 
      params.parent1Id == 0 || 
      params.parent2Id == 0 || 
      params.parent3Id == 0 || 
      params.title.length == 0 ||
      params.fio.length == 0 || 
      params.quest.length == 0) {
      error = true;
      
      $(".error-not").fadeIn();
    } else {
      $.post(
        "/api/quest/create",
        params,
        function(data) {
          $(".vopotvaddf-widget .in").html("Ваше сообщение добавлено");
        }
      );
    }
  }
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

var VadminView = Backbone.View.extend({
  className: 'vadmin',
  events:  {
    "click .status_list a": "onStatusChange"
  },

  initialize: function () {
    this.template = $('#vadmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },

  onStatusChange: function(e) {
    var status = $(e.target).parent().attr("data-status");
    if(status) {
      $(".let").fadeOut();
      $(".let[data-status='"+status+"']").fadeIn();  
    } else {
      var pub = $(e.target).parent().attr("data-pub");
      $(".let").fadeOut();
      $(".let[data-pub='"+pub+"']").fadeIn();  
    }
  }
});

var VopotStView = Backbone.View.extend({
  className: 'vopotvst',
  events: {
    "click .deleteQuestnav": "onDeleteQuestnav",
    "click .lnav a": "onSelect"
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
  },
  onSelect: function(e) {
    var id = $(e.target).attr('data-id');
    console.log(id);
    if(id != 0) {
      $(".q").fadeOut();
      $(".q[data-nav='"+id+"']").fadeIn();
    } else {
      $(".q").fadeIn();
    }
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
  events: {
    "change #pred1-select": "onOptionClick"
  },

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
  },

  onOptionClick: function(e) {
    $("#pred2-select").removeAttr("disabled");
    $("#pred2-select option:first-child").attr("selected", "selected");
    $("#pred2-select option").hide();
    $("#pred2-select option[data-parent='"+$(e.target).val()+"']").show();
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

    this.questList = new QuestList();
    this.questList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { quests: this.questList.toJSON() }));
    
    return this;
  }
});

var ValistView = Backbone.View.extend({
  className: 'valist',

  initialize: function () {
    this.template = $('#valist-template').html();

    this.questList = new QuestList();
    this.questList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { quests: this.questList.toJSON() }));
    
    return this;
  }
});

var VeditView = Backbone.View.extend({
  className: 'vedit',

  initialize: function (opt) {
    this.template = $('#vedit-template').html();

    this.vootnav = new VootnavView();
    this.vootbox = new VootboxView();
    this.vopotvadmin = new VopotvadminView();
    this.st = new VopotStView();
    this.admin = new VadminView();
    this.valist = new ValistView();
    this.veditf = new VeditfView({id: opt.id});
    this.veditfr = new VeditfrView({id: opt.id});
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.vootnav.el);
    this.vootnav.setElement(this.$(".vootnav-widget")).render();

    $(this.el).append(this.st.el);
    this.st.setElement(this.$(".vopotvst-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.vopotvadmin.el);
      this.vopotvadmin.setElement(this.$(".vopotvadmin-widget")).render();

      $(this.el).append(this.admin.el);
      this.admin.setElement(this.$(".vadmin-widget")).render();

      $(this.el).append(this.valist.el);
      this.valist.setElement(this.$(".valist-widget")).render(); 

      $(this.el).append(this.veditf.el);
      this.veditf.setElement(this.$(".veditf-widget")).render();

      $(this.el).append(this.veditfr.el);
      this.veditfr.setElement(this.$(".veditfr-widget")).render();  
    } else {
      $(this.el).append(this.vootbox.el);
      this.vootbox.setElement(this.$(".vootbox-widget")).render();
    }
    
    return this;
  }
});

var VeditfView = Backbone.View.extend({
  className: 'veditf',
  events: {
    "click #veditLUpdate": "onVeditLUpdate"
  },

  initialize: function (opt) {
    this.template = $('#veditf-template').html();

    this.questOneList = new QuestOneList({}, {id: opt.id});
    this.questOneList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { quests: this.questOneList.toJSON() }));
    
    return this;
  },

  onVeditLUpdate: function(e) {
    var params = {};
    params.quest = $("#l_quest").val();
    params.text = $("#l_text").val();

    if($("#l_status").prop("checked")) {
      params.pub = 1;
    } else {
      params.pub = 0;
    }

    $.post(
      "/api/quest/edit/"+$(e.target).attr("data-id"),
      params,
      function(data) {
        window.location.hash = '#!/questions';
      }
    );
  }
});

var VeditfrView = Backbone.View.extend({
  className: 'veditfr',
  events: {
    "click #veditRUpdate": "onVeditRUpdate"
  },

  initialize: function (opt) {
    this.template = $('#veditfr-template').html();

    this.questOneList = new QuestOneList({}, {id: opt.id});
    this.questOneList.fetch();

    this.userList = new Questinsrole();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { quests: this.questOneList.toJSON() }));

    $(this.el).append(this.userList.el);
    this.userList.setElement(this.$(".questinsrole-widget")).render(this.questOneList.toJSON()[0].adminId);
    
    return this;
  },

  onVeditRUpdate: function(e) {
    var params = {};
    params.status  = $("#quiz_status option:selected").val();
    params.adminId = $("#roleId option:selected").val();

    if($("#quiz_pub").prop("checked")) {
      params.pub = 1;
    } else {
      params.pub = 0;
    }

    $.post(
      "/api/quest/edit/"+$(e.target).attr("data-id"),
      params,
      function(data) {
        window.location.hash = '#!/questions';
      }
    );
  }
});

var Questinsrole = Backbone.View.extend({
  className: 'questinsrole',

  initialize: function (opt) {
    this.template = $('#questinsrole-template').html();

    this.userList = new UserList();
    this.userList.fetch();
  },

  render: function (currentUserId) {
    $(this.el).html(_.template(this.template, { users: this.userList.toJSON(), currentUserId: currentUserId }));
    
    return this;
  }
});

var QuestModel = Backbone.Model.extend();

var QuestList = Backbone.Collection.extend({
   model: QuestModel,
   url: '/api/quest',
   parse: function(response, xhr) {
      return response.quests;
  }
});

var UserModel = Backbone.Model.extend();

var UserList = Backbone.Collection.extend({
   model: UserModel,
   url: '/api/user',
   parse: function(response, xhr) {
      return response.users;
  }
});

var QuestOneModel = Backbone.Model.extend();

var QuestOneList = Backbone.Collection.extend({
   model: QuestModel,
   url: '/api/quest',
   initialize: function(models, options) {
    this.id = options.id;
    this.url = '/api/quest/'+this.id;
   },
   parse: function(response, xhr) {
      return response.quests;
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