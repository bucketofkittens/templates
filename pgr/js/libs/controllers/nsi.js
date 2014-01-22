/**
 * Контроллер страницы редактирования лиги
 * @param {[type]} $scope [description]
 */
function NSIController($scope, Leagues, $rootScope, $timeout) {

    /**
     * Добавляем новую лигу
     */
    $scope.addLeague = function() {
        $rootScope.$broadcast('openModal', { name: 'nsi-add'});

        $timeout(function(){
            $rootScope.$broadcast('nseAddOpen', { size: $scope.workspace.leagues.length});
        }, 100);
    }

    /**
     * Удаление лиги
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.delete = function(value) {
        Leagues.del({id: value.sguid}, {}, function(data) {
            angular.forEach($scope.workspace.leagues, function(value2, key2){
                if(value2.sguid == value.sguid) {
                    $scope.workspace.leagues.splice(key2, 1);
                }
            });
        }); 
    }

    /**
     * Закрываем окошко и иницилизируем пересчет пользователей
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.ok = function(value) {
        $rootScope.$broadcast('loaderShow');

        Leagues.recal({}, {}, function(data) {
            $rootScope.$broadcast('closeModal');
            $rootScope.$broadcast('loaderHide');
            location.reload();
        }); 
    }

    /**
     * Обновление лиги
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    $scope.update = function(value) {
        var sguid = value.sguid;

        delete value.icon;
        delete value.sguid;
        delete value.$$hashKey;

        Leagues.updateLeague(
            {id: sguid}, 
            {
                "league": JSON.stringify(value)
            }, function(data) {
            }
        );
    }
}