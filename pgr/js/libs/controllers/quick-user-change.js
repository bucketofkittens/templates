/**
 * [QuickUserChangeCtrl description]
 * @param {[type]} $scope     [description]
 * @param {[type]} User       [description]
 * @param {[type]} AuthUser   [description]
 * @param {[type]} $rootScope [description]
 * @param {[type]} $location  [description]
 */
function QuickUserChangeCtrl($scope, User, AuthUser, $rootScope, $location, $route, $cookieStore) {
    $scope.users = [];

    $scope.onMoveUserClick = function($event, nextUser) {
        AuthUser.set(nextUser.sguid);
        
        $scope.workspace.user = nextUser;
        $scope.authUserId = nextUser.sguid;

        $cookieStore.remove("openGoal");
        $cookieStore.remove("openNeed");

        window.location.reload();
    }

    User.get_all({}, {}, function(data) {
        data.sort(function(a, b){
            if(a.login < b.login) return -1;
            if(a.login > b.login) return 1;
            return 0;
        })
        var users = [];
        angular.forEach(data, function(value, key){
            if(value.published == 1) {
                users.push(value);
            }
        });
        angular.forEach(users, function(value, key){
            value.fullname = value.login + ", " + value.name;
        });
        $scope.users = users;
    }); 
}