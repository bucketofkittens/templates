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