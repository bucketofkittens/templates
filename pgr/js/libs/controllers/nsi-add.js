/**
 * Контроллер добавления NSI
 * @param {[type]} $scope [description]
 */
function NSIAddController($scope, Leagues, $rootScope) {
    $scope.form = {
        name: "",
        min_border: "",
        max_border: ""
    };

    $scope.size = 0;

    $scope.$on('nseAddOpen', function(event, message) {
        console.log(message);
        $scope.size = message.size;
    });

    $scope.close = function() {
        $rootScope.$broadcast('openModal', { name: 'nsi'});
    }

    $scope.addLeague = function() {
        $scope.form.position = $scope.size+1;

        Leagues.create({}, {
            "league": JSON.stringify($scope.form)
        }, function(data) {
            console.log(data);
            $scope.close();
        });
    }
}