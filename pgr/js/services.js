var host = "http://xmpp.dev.improva.com:9090\:9090/api/v1";
//var host = "http://192.168.1.176:3000\:3000/api/v1";
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
            updateUser: {method: 'PUT', headers : {'Content-Type': 'application/x-www-form-urlencoded'} },
            'query': {
            	method: 'GET', 
            	transformResponse: function (data) {
            		return angular.fromJson(data)[0].user
            	},
            }
        }
    );
});

pgrModule.factory('Needs', function ($resource) {
    return $resource(
        host+'/needs/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'},
            updateUser: {method: 'PUT'}
        }
    );
});

pgrModule.factory('Goals', function ($resource) {
    return $resource(
        host+'/goals/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'},
            updateUser: {method: 'PUT'}
        }
    );
});

pgrModule.factory('Professions', function ($resource) {
    return $resource(
        host+'/professions/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'},
            updateUser: {method: 'PUT'}
        }
    );
});

pgrModule.factory('States', function ($resource) {
    return $resource(
        host+'/states/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST'},
            updateUser: {method: 'PUT'}
        }
    );
});



