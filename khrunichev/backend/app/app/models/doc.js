var Doc = function () {

  this.defineProperties({
    creatorId: {type: 'string'},
    file: {type: 'string'},
    title: {type: 'string'},
    status: {type: 'int'},
    access1: {type: 'text'},
    access2: {type: 'text'},
    access3: {type: 'text'},
    access4: {type: 'text'},
    access1Id: {type: 'string'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  Предприятие 1
   Отдел 1
   Старший механик

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

