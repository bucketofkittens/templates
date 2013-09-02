//var host = "http://192.168.1.176:3000/api/v1";
var host = "http://xmpp.dev.improva.com:9090/api/v1";
var hostShort = host.replace("/api/v1", "");

function createImageFullPath(obj) {
    return obj.scheme+"://"+obj.host+":"+obj.port+obj.path+"?"+obj.query;
}

/**
 * Модель пользователя
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('User', function ($resource) {
    return $resource(
        host+'/users/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'},
            updateUser: {method: 'PUT'},
            'query': {
            	method: 'GET', 
            	transformResponse: function (data) {
                    var user = angular.fromJson(data)[0].user;
                    
                    if(user.avatar) {
                        user.avatar.full_path = createImageFullPath(user.avatar);    
                    }
                    if(user.league && user.league.icon) {
                         user.league.icon.full_path = createImageFullPath(user.league.icon);
                    }
            		return user;
            	}
            },
            "by_league": {
                method: 'GET',
                isArray: true,
                url: host+"/users/by_league/:league_guid",
                transformResponse: function (data) {
                    
                    if(data) {
                        var users = angular.fromJson(data);

                        angular.forEach(users, function(value, key){
                            if(users[key].user.avatar) {
                                users[key].user.avatar.full_path = createImageFullPath(users[key].user.avatar);
                            }
                        });

                        return users; 
                    }
                    
                    
                }
            },
            "needs_points": {
                method: 'GET',
                url: host+"/users/:id/needs_points"
            },
            "goals_points": {
                method: 'GET',
                url: host+"/users/:id/goals_points"
            }
        }
    );
});

/**
 * Модель картинов
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Picture', function ($resource) {
    return $resource(
        host+'/pictures/:id', 
        {id:'@id'}, 
        {
            create: {method: 'PUT', headers : {'Content-Type': 'multipart/form-data'}},
            updatePicture: {method: 'PUT', headers : {'Content-Type': 'application/x-www-form-urlencoded'} }
        }
    );
});



/**
 * Модель для Needs
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Needs', function ($resource) {
    return $resource(
        host+'/needs/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'}
        }
    );
});

/**
 * 
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('NeedsByUser', function ($resource) {
    return $resource(
        host+'/needs/by_user/:id', 
        {id:'@id'}
    );
});

/**
 * 
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('GoalsByUser', function ($resource) {
    return $resource(
        host+'/goals/by_user/:id', 
        {id:'@id'}
    );
});

/**
 * Модель для Goals
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Goals', function ($resource) {
    return $resource(
        host+'/goals/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'}
        }
    );
});

/**
 * Модель профессий
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Professions', function ($resource) {
    return $resource(
        host+'/professions/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'}
        }
    );
});

/**
 * Модель для штатов
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('States', function ($resource) {
    return $resource(
        host+'/states/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'}
        }
    );
});

/**
 * Модель для списка критериев
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Criterion', function ($resource) {
    return $resource(
        host+'/criterion/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'}
        }
    );
});

/**
 * 
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('CriterionByGoal', function ($resource) {
    return $resource(
        host+'/criterion/by_goal/:id', 
        {id:'@id'}
    );
});

/**
 * 
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('Sessions', function ($resource) {
    return $resource(
        hostShort+'/signin/', 
        {}, 
        {
            signin: {method: 'POST',  headers : {'Content-Type': 'application/x-www-form-urlencoded'}}
        }
    );
});

pgrModule.factory('Friendships', function ($resource) {
    return $resource(
        host+'/friendships/', 
        {}, 
        {
            create: {method: 'POST'},
            del: {method: "DELETE"},
            "by_user": {
                method: 'GET',
                isArray: true,
                url: host+"/friendships/by_user/:user_guid",
                transformResponse: function (data) {
                    var frends = angular.fromJson(data);
                    var users = [];
                    angular.forEach(frends, function(value, key){
                        if(value.friendship.user.avatar) {
                            value.friendship.user.avatar.full_path = createImageFullPath(value.friendship.user.avatar);
                        }
                        var user = {
                            user: value.friendship.user
                        }
                        users.push(user);
                    });
                    return users;
                }
            }
        }
    );
});




/**
 * 
 * @param  {[type]} $cookies [description]
 * @return {[type]}          [description]
 */
pgrModule.factory('AuthUser', function ($cookieStore) {
    var AuthUser = function() {
        this.get = function() {
            return $cookieStore.get("user");
        }

        this.set = function(guid) {
            $cookieStore.put("user", guid); 
        }

        this.logout = function() {
            $cookieStore.remove("user"); 
        }
    };
    return new AuthUser();
});

/**
 * 
 * @param  {[type]} AuthUser  [description]
 * @param  {[type]} $location [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('LogoutService', function (AuthUser, $location, $rootScope) {
    AuthUser.logout();

    $location.path("/");
    $rootScope.$broadcast('logout');
});


pgrModule.factory('UserCriteriaValue', function ($resource) {
    return $resource(
        host+'/user_criterion_values/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST',  headers : {'Content-Type': 'application/x-www-form-urlencoded'}},
            del: {method: "DELETE"}
        }
    );
});

pgrModule.factory('UserCriteriaValueByUser', function ($resource) {
    return $resource(
        host+'/user_criterion_values/by_user/:id', 
        {id:'@id'}
    );
});

pgrModule.factory('Leagues', function ($resource) {
    return $resource(
        host+'/leagues/:id', 
        {id:'@id'}
    );
});
