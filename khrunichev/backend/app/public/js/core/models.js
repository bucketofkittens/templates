(function () {
var Client = function () {

  this.defineProperties({
    email: {type: 'string'},
    password: {type: 'string'},
    fio: {type: 'string'},
    parentId: {type: 'string'},
    parent2Id: {type: 'string'},
    parent3Id: {type: 'string'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
User.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
User.someStaticMethod = function () {
  // Do some other stuff
};
User.someStaticProperty = 'YYZ';
*/

Client = geddy.model.register('Client', Client);

}());

(function () {
var Doc = function () {

  this.defineProperties({
    creatorId: {type: 'string'},
    file: {type: 'string'},
    title: {type: 'string'},
    status: {type: 'int'},
    access: {type: 'text'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Doc = geddy.model.register('Doc', Doc);

}());

(function () {
var Docnode = function () {

  this.defineProperties({
    text: {type: 'text', required: true},
    docId: {type: 'string'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Docnode = geddy.model.register('Docnode', Docnode);

}());

(function () {
var Event = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    text: {type: 'text'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Event = geddy.model.register('Event', Event);

}());

(function () {
var Hall = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    fio: {type: 'string'},
    photo: {type: 'string'},
    text: {type: 'text'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Hall = geddy.model.register('Hall', Hall);

}());

(function () {
var News = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    anonce: {type: 'text'},
    text: {type: 'text'},
    image: {type: 'string'}
  });

  this.belongsTo('Newsnav');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

News = geddy.model.register('News', News);

}());

(function () {
var Newsnav = function () {

  this.defineProperties({
    title: {type: 'string', required: true}
  });

  this.hasMany('News');

  

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Newsnav = geddy.model.register('Newsnav', Newsnav);

}());

(function () {
var Newspaper = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    text: {type: 'string'},
    link: {type: 'string'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Newspaper = geddy.model.register('Newspaper', Newspaper);

}());

(function () {
var Passport = function () {
  this.defineProperties({
    authType: {type: 'string'},
    key: {type: 'string'}
  });

  this.belongsTo('User');
};

Passport = geddy.model.register('Passport', Passport);
}());

(function () {
var Quest = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    parent1Id: {type: 'string'},
    parent2Id: {type: 'string'},
    parent3Id: {type: 'string'},
    fio: {type: 'string'},
    email: {type: 'string'},
    text: {type: 'text'},
    status: {type: 'string'},
    quest: {type: 'text'},
    adminId: {type: 'string'},
    pub: {type: 'string'}
  });

  this.belongsTo('Questnav');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Quest = geddy.model.register('Quest', Quest);

}());

(function () {
var Questnav = function () {

  this.defineProperties({
    title: {type: 'string', required: true}
  });

  this.hasMany('Quest');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Questnav = geddy.model.register('Questnav', Questnav);

}());

(function () {
var Role = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
  });

  this.hasMany('Users');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Role = geddy.model.register('Role', Role);

}());

(function () {
var Struct = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    leader: {type: 'string'},
    parentId: {type: 'string'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
News.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
News.someStaticMethod = function () {
  // Do some other stuff
};
News.someStaticProperty = 'YYZ';
*/

Struct = geddy.model.register('Struct', Struct);

}());

(function () {
var User = function () {

  this.defineProperties({
    email: {type: 'string'},
    password: {type: 'string'}
  });
  
  

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
User.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
User.someStaticMethod = function () {
  // Do some other stuff
};
User.someStaticProperty = 'YYZ';
*/

User = geddy.model.register('User', User);

}());