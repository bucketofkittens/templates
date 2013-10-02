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