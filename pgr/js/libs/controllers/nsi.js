/**
 * Контроллер страницы редактирования лиги
 * @param {[type]} $scope [description]
 */
function NSIController($scope, Leagues, $rootScope, $timeout) {
    /**
    * Забираем запросом список лиг.
    * @param  {[type]} data [description]
    * @return {[type]}      [description]
    */
    Leagues.query({}, {}, function(data) {
        $scope.leagues = data;
    })

    $scope.addLeague = function() {
        $rootScope.$broadcast('openModal', { name: 'nsi-add'});

        $timeout(function(){
            $rootScope.$broadcast('nseAddOpen', { size: $scope.leagues.length});
        }, 100);
    }

    $scope.edit = function(value) {
        $rootScope.$broadcast('openModal', { name: 'nsi-edit'});

        $timeout(function(){
            $rootScope.$broadcast('nseEditOpen', { league: value});
        }, 100);
    }

    $scope.delete = function(value) {
        Leagues.del({id: value.sguid}, {}, function(data) {
            angular.forEach($scope.leagues, function(value2, key2){
                if(value2.sguid == value.sguid) {
                    $scope.leagues.splice(key2, 1);
                }
            });
        }); 
    }
}