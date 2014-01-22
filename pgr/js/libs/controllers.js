'use strict';

function RightUserController($scope, $location) {
    $scope.compare = true;
    if($location.search().user2) {
        $scope.rightId = $location.search().user2;
    }
}

function LeftUserController($scope, $location) {
    $scope.compare = true;
}










function ContentController($scope, $rootScope, $route, $location) {
    
}





/** Контроллер графика */
function GraphsController($scope, $rootScope, $route, $location, Leagues, User) {
    /**
     * Сурово и беспощадно.
     * Надо будет переписать
     * @return {[type]} [description]
     */
    setInterval(function() {
        var key = 0;
        $.each($("#graphs tr"), function(key, value){ 
            key += 1;
            $.each($(value).find("td"), function(keyd, valued){
                var a = 10;
                var points = parseInt($(valued).attr("data-points"));
                var step = ($(valued).attr("data-step"))*10000;
                if(points) {
                    if(points != 0) {
                        $(valued).find("a").css("top", (step-points)/100+"%");
                        $(valued).find("a").attr("data-sp", (step-points)/100);
                    } else {
                        $(valued).find("a").css("top", "100%");
                    }
                } else {
                    $(valued).find("a").css("top", "100%");
                }
                $(valued).find("a").css("z-index", key);
            })
        })
    }, 100);

    /**
     * Забираем список всех лиг
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    Leagues.query({}, {}, function(data){
        $scope.leagues = data;

        /**
         * Забираем пользователей для каждой лиги
         * @param  {[type]} value [description]
         * @param  {[type]} key   [description]
         * @return {[type]}       [description]
         */
        angular.forEach($scope.leagues, function(value, key){
            User.by_league({league_guid:value.sguid}, {}, function(v2, k2){
                v2.sort(function(a, b) {
                    if(a.points < b.points) return 1;
                    if(a.points > b.points) return -1;
                    return 0;
                })
                var users = v2;
                if(users.length < 10) {
                    var i = 0;
                    for(i = users.length; i <= 10; i++) {
                        users.push({});
                    }
                }
                value.users = users;
            })
        });

    })

    /**
     * Забираем список всех пользователей и выбираем только тех у которых 0 пользователей
     * @param  {[type]} datas [description]
     * @return {[type]}       [description]
     */
    User.get_all({}, {}, function(datas) {
        $scope.looserUser = datas.filter(function(item) {
            if(item.points == 0) {
                return item;
            }
        });
    });
}

function NeighboursCtrl($scope) {
}



function TopGalleryController($scope, Leagues, User, $routeParams, $location, $rootScope) {
    $scope.limit = 10;
    $scope.skip = 0;
    $scope.users = [];
    $scope.league_sguid = null;
    $rootScope.topUsers = [];

    $scope.onUserPage = function(userItem) {
        $location.path("/profile/").search({user: userItem.sguid});
    }

    $scope.getNewPage = function(league_sguid) {
        User.by_league_and_limit({league_guid: league_sguid, limit: $scope.limit, skip: ($scope.skip*$scope.limit)+1}, {}, function(newUsers) {
            angular.forEach(newUsers, function(value, key) {
                if($routeParams.userId1 != value.sguid) {
                    value.points = parseInt(value.points);
                    value.show = true;
                    $scope.users.push(value);
                    $rootScope.topUsers.push(value);
                }
            });
        });
    }

    $scope.$on("incrTopPage", function($event, message) {
        $scope.skip += 1;
        $scope.getNewPage($scope.league_sguid);
    });

    $scope.$on("userControllerGetUser", function($event, message) {
        if(!$rootScope.topUsers || $rootScope.topUsers.length == 0) {
            $scope.league_sguid = message.user.league.sguid;
            $scope.getNewPage(message.user.league.sguid);
        } else {
            if(!$scope.users ||  $scope.users.length == 0) {
                $scope.users = $rootScope.topUsers;    
            }
        }
    });
}



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function LeaguesController($scope, Leagues, User) {
    $scope.leagues = [];

    /**
    * Забираем запросом список лиг.
    * @param  {[type]} data [description]
    * @return {[type]}      [description]
    */
    Leagues.query({}, {}, function(data) {
        data = data.reverse();

        $scope.leagues = data;
        angular.forEach($scope.leagues, function(value, key){
           User.by_league({league_guid: value.sguid}, {}, function(v2, k2) {
                v2 = v2.filter(function(value) {
                    if(value.published == 1) {
                        return value;
                    }
                });
                value.users = v2;
            })
        });
    })
}





function ChangeEmailController($scope, User, $location, Sessions) {
    $scope.form = {
        password: "",
        newEmail: ""
    }

    $scope.onCancel = function() {
        $location.path("/my_profile");
    }

    $scope.onChangeEmail = function() {
        Sessions.signin({}, $.param({
            "login": $scope.workspace.user.login,
            "password": $scope.form.password
        }), function(data) {
            if(data.success) {
                var user = {
                    "email": $scope.form.newEmail
                }

                User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                        $scope.workspace.user.email = $scope.form.newEmail;
                        $location.path("/my_profile/");
                    }
                );
            } else {
                $scope.error = data.message;
            }
        });
    }
}



function FollowCaruselController($scope) {
    $scope.position = 0;
    $scope.countFrend = 0;

    $scope.onLeft = function() {
        $scope.position -= 1;
    }

    $scope.onRight = function() {
        $scope.position += 1;
    }

    $scope.$watch("frends", function (newVal, oldVal, scope) {
        $scope.countFrend = newVal.length;
    });
}







function ConfirmController($scope, ConfirmSignup, $routeParams, $location) {
    ConfirmSignup.test({hash: $routeParams.hash}, {}, function(data) {
        if(data) {
            $location.path("/login/").search({ onSuccess: true});
        } else {
            $location.path("/login/").search({ onSuccess: true});
        }
    });
}

function NeighboursGalleryController($scope) {

}