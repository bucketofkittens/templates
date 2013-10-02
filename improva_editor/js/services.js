var host = "http://dev.api.improva.com/api/v1";

/** получаем список юзеров */
editorModule.factory('Userlist', function ($resource) {
   return $resource(
		host+'/users/:id', 
		{id:'@id'}, 
		{
		   create: {method: 'POST'},
		   updateUser: {method: 'PUT'}
	   }
   );
});