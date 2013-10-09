var host = "http://dev.api.improva.com/api/v1";

/** страница юзеров */
editorModule.factory('Userlist', function ($resource) {
   return $resource(
		host+'/users/:id', 
		{id:'@id'}, 
		{
		   create: {method: 'POST'},
		   updateUser: {method: 'PUT'},
		   "getOne": {
				method: 'GET',
				isArray: false
			},
         "getCritVal": {
            method: 'GET',
            url: host+"/user_criterion_values/by_user/:user_guid",
				isArray: true
         }
	   }
   );
});

/** нидсы для профиля */
editorModule.factory('Needslist', function ($resource) {
   return $resource(
		host+'/needs/:id', 
		{id:'@id'}
   )
});

/** пересчет колбас */
editorModule.factory('UserCriteria_value', function ($resource) {
    return $resource(
        host+'/user_criterion_values/:id', 
        {id:'@id'}, 
        {
            create: {method: 'POST',  headers : {'Content-Type': 'application/x-www-form-urlencoded'}},
            del: {method: "DELETE"}
        }
    );
});


/** страница провайдеров */
editorModule.factory('Providlist', function ($resource) {
   return $resource(
		host+'/providers',
		{
		   create: {method: 'POST'},
		   updateProvid: {method: 'PUT'},
	   }
   );
});