/**
 * Контроллер добавления NSI
 * @param {[type]} $scope [description]
 */
function NSIEditController($scope, Leagues, $rootScope) {
    $scope.league = null;

    $scope.close = function() {
        $rootScope.$broadcast('openModal', { name: 'nsi'});
    }

    $scope.$on('nseEditOpen', function(event, message) {
        $scope.league = message.league;
    });

    $scope.editLeague = function() {
        var sguid = $scope.league.sguid;

        delete $scope.league.icon;
        delete $scope.league.sguid;
        delete $scope.league.$$hashKey;

        Leagues.updateLeague(
            {id: sguid}, 
            {
                "league": JSON.stringify($scope.league)
            }, function(data) {
                $scope.close();
            }
        );
    }
}