/**
 * Контроллер страницы профиля
 * @param {type} $scope
 * @param {type} $routeParams
 * @param {type} AuthUser
 * @param {type} $route
 * @param {type} $rootScope
 * @param {type} $location
 * @returns {undefined}
 */
function ProfileController($scope, $routeParams, AuthUser, $route, $rootScope, $location) {
    $scope.comments = 0;

    $scope.onShowComments = function() {
        if($scope.comments == 0) {
            $scope.comments = 1;   
        }

        $rootScope.$broadcast('openComments', {  });
    }

    $scope.closeComments = function() {
        $scope.comments = 0;
    }

    $scope.$on('closeComments', function() {
        $scope.comments = 0;
    });
    


    $scope.updateOnScrollEvents = function($event, isEnd) {
        if(isEnd) {
            $rootScope.$broadcast('incrTopPage');
        }
    }
}