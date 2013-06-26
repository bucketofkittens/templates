var StrView = Backbone.View.extend({
  className: 'str',

  initialize: function () {
    this.template = $('#str-template').html();
    this.strnav = new StrnavView();
    this.strbox = new StrboxView();
    this.stradmin = new StradminView();
    this.strauth = new StrAuthView();
    this.strclient = new StrClientView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

  	$(this.el).append(this.strnav.el);
  	this.strnav.setElement(this.$(".strnav-widget")).render();

  	$(this.el).append(this.strbox.el);
  	this.strbox.setElement(this.$(".strbox-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.stradmin.el);
      this.stradmin.setElement(this.$(".stradmin-widget")).render(); 
    } else {
      if(window.clientUser.id) {
        $(this.el).append(this.strclient.el);
        this.strclient.setElement(this.$(".strclient-widget")).render();
      } else {
        $(this.el).append(this.strauth.el);
        this.strauth.setElement(this.$(".strauth-widget")).render();  
      }
    }
    
    return this;
  }
});

var StrAddView = Backbone.View.extend({
  className: 'stradd',
  events: {
    "click #strAddCancel": "onStrAddCancel",
    "click #strAdd": "onStrAdd"
  },

  initialize: function () {
    this.template = $('#stradd-template').html();
    this.strnav = new StrnavView();
    this.strbox = new StrAddFView();
    this.stradmin = new StradminView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.strnav.el);
    this.strnav.setElement(this.$(".strnav-widget")).render();

    $(this.el).append(this.strbox.el);
    this.strbox.setElement(this.$(".straddf-widget")).render();

    if(window.user.id) {
      $(this.el).append(this.stradmin.el);
      this.stradmin.setElement(this.$(".stradmin-widget")).render(); 
    }
    
    return this;
  },

  onStrAddCancel: function() {
    window.location.hash = '#!/structure';
  },

  onStrAdd: function() {
    var params = {};
    params.title = $("#add_str_title").val();
    params.leader = $("#add_str_leader").val();
    params.parentId = $("#add_str_parent option:selected").val();

    $.post('/api/structure/create', params, function(data) {
       window.location.hash = '#!/structure';
    })
    
  }
});

var StrAddFView = Backbone.View.extend({
  className: 'straddf',

  initialize: function () {
    this.template = $('#straddf-template').html();
    this.treeSelect = new StrTreeSelectView();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));

    $(this.el).append(this.treeSelect.el);
    this.treeSelect.setElement(this.$(".strtreeselect-widget")).render();
    
    return this;
  }
});

var StrClientView = Backbone.View.extend({
  className: 'strclient',

  initialize: function () {
    this.template = $('#strclient-template').html();

    this.strList = new StrList();
    this.strList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { client: window.clientUser, structs: this.strList.toJSON() }));
    
    return this;
  }
});

var StrAuthView = Backbone.View.extend({
  className: 'straut',
  events: {
    "click #strEnter": "onStrEnter"
  },

  initialize: function () {
    this.template = $('#straut-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  },

  onStrEnter: function(e) {
    var login = $("#add_strenter_login").val();
    var passw = $("#add_strenter_passw").val();
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
        "/api/auth/client/login",
        {email: login, password: passw},
        function(data) {
          if(data.status == "ok") {
            window.clientUser = data.user;
            window.location.reload();
          } else {
            $(".error-not").fadeIn();
          }
        }
      );
    }
  }
});

var StrTreeSelectView = Backbone.View.extend({
  className: 'strtreeselect',

  initialize: function () {
    this.template = $('#strtreeselect-template').html();

    this.strList = new StrList();
    this.strList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { structs: this.strList.toJSON() }));
    
    return this;
  }
});

var StradminView = Backbone.View.extend({
  className: 'stradmin',

  initialize: function () {
    this.template = $('#stradmin-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var StrnavView = Backbone.View.extend({
  className: 'strnav',

  initialize: function () {
    this.template = $('#strnav-template').html();
  },

  render: function () {
    $(this.el).html(_.template(this.template, this.context));
    
    return this;
  }
});

var StrboxView = Backbone.View.extend({
  className: 'strbox',
  events: {
    "click .deleteStr": "onDeleteStr"
  },

  initialize: function () {
    this.template = $('#strbox-template').html();

    this.strList = new StrList();
    this.strList.fetch();
  },

  render: function () {
    $(this.el).html(_.template(this.template, { structs: this.strList.toJSON() }));
    
    return this;
  },

  onDeleteStr: function(e) {
    var self = this;
    $.get(
      "/api/structure/delete/"+$(e.target).attr("data-id"),
      function(data) {
        window.location.reload();
      }
    );
  }
});

var StrModel = Backbone.Model.extend();

var StrList = Backbone.Collection.extend({
   model: StrModel,
   url: '/api/structure/',
   parse: function(response, xhr) {
      return response.structs;
   }
});