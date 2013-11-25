var debugHost = "http://192.168.1.116:3000/api/v1";
var host = "http://dev.sir.improva.com/api/v1";
var hostShort = host.replace("/api/v1", "");

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
                    if(data) {
                        var user = angular.fromJson(data)[0];
                        return user;    
                    }
            	}
            },
            'get_short': {
                method: 'GET',
                url: host+"/users/:id/light",
                cache: true
            },
            'get_from_to_points': {
                method: 'GET',
                url: host+"/users/by_points/from/:from/to/:to",
                isArray: true
            },
            'get_all': {
                method: 'GET',
                isArray: true
            },
            'only_published': {
                method: 'GET',
                isArray: true,
                url: host+"/users/only/published"
            },
            'for_main': {
                method: 'GET',
                isArray: true,
                url: host+"/users/for/main/"
            },
            "by_league": {
                method: 'GET',
                isArray: true,
                url: host+"/users/by_league/:league_guid"
            },
            "update_legue": {
                url: host+"/users/:id/league",
                method: "POST"
            },
            "needs_points": {
                method: 'GET',
                url: host+"/users/:id/needs_points"
            },
            "goals_points": {
                method: 'GET',
                url: host+"/users/:id/goals_points"
            },
            "get_friends": {
                method: 'GET',
                url: host+"/users/:id/friends",
                isArray: true
            },
            "create_friendship": {
                method: "POST",
                url: host+"/users/:id/friends"
            },
            "destroy_friendship": {
                method: "DELETE",
                url: host+"/users/:id/friends/:friendId"
            },
            "by_state": {
                method: "GET",
                isArray: true,
                url: host+"/users/by_state/:state_guid"
            },
            "by_profession": {
                method: "GET",
                isArray: true,
                url: host+"/users/by_profession/:profession_guid"
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
            create: {method: 'POST'},
            query: {
                method: 'GET',
                isArray: true
            }
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
            query: {
                method: 'GET',
                isArray: true
            }
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
        host+'/goals/:id/professions', 
        {id:'@id'}, 
        {
            create: {
                method: 'POST',
                url: host+"/professions"
            },
            del: {method: "DELETE"}
        }
    );
});

pgrModule.factory('MailHash', function ($resource) {
    return $resource(
        host+'/users/mail_reset_hash/', 
        {}, 
        {
            create: {
                method: 'POST'
            }
        }
    );
});

pgrModule.factory('ProfessionCreate', function ($resource) {
    return $resource(
        host+'/professions', 
        {},
        {
            create: {
                method: 'POST'
            },
            del: {
                url: host+'/professions/:id', 
                method: "DELETE"
            }
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
        {id:'@id'},
        {
            query: {
                method: 'GET',
                isArray: true
            }
        }
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
        {id:'@id'}, 
        {
            "query": {
                method: 'GET',
                isArray: true
            }
            
        }
    );
});

pgrModule.factory('Leagues', function ($resource) {
    return $resource(
        host+'/leagues/:id', 
        {id:'@id'}, 
        {
            "by_position": {
                method: 'GET',
                url: host+"/leagues/by_position/:position"
            }
        }
    );
});

pgrModule.factory('Social', function ($resource) {
    return $resource(
        hostShort+'/signin/oauth2', 
        {},
        {
            "login": {
                method: 'POST'
            }
            
        }
    );
});

