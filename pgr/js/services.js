var host = "http://xmpp.dev.improva.com:9090\:9090/api/v1";

/**
 * Модель пользователя
 * @param  {[type]} $resource [description]
 * @return {[type]}           [description]
 */
pgrModule.factory('User', function ($resource) {
    return $resource(
        host+'/users/:userId', 
        {userId:'@id'}, 
        {
            create: {method: 'POST'},
            update: {method: 'PUT'},
            'query': {
            	method: 'GET', 
            	transformResponse: function (data) {
            		return angular.fromJson(data)[0].user
            	},
            }
        }
    );
});