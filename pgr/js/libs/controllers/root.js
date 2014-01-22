/**
 * Основной контроллер.
 * В нем используются данные которые нужны на всех страницах.
 * @param {[type]} $scope       [description]
 * @param {[type]} $facebook    [description]
 * @param {[type]} AuthUser     [description]
 * @param {[type]} User         [description]
 * @param {[type]} $rootScope   [description]
 * @param {[type]} Needs        [description]
 * @param {[type]} Social       [description]
 * @param {[type]} $cookieStore [description]
 * @param {[type]} States       [description]
 * @param {[type]} Professions  [description]
 * @param {[type]} $location    [description]
 * @param {[type]} $timeout     [description]
 * @param {[type]} Leagues      [description]
 */
function RootController($scope, $facebook, AuthUser, User, $rootScope, Needs, Social, $cookieStore, States, Professions, $location, $timeout, Leagues) {
    
    /**
     * Открывает модальное окно
     * @param  {[type]} nameModal название модального окна
     * @return {[type]}           [description]
     */
    $scope.showModal = function(nameModal) {
        $rootScope.$broadcast('openModal', { name: nameModal});
    }

    /**
     * Открываем окно авторизации
     * @returns {undefined}
     */
    $scope.onLogin = function() {
        $location.path("/login/");
    };

    /**
     * Переход на страницу профиля
     * @return {undefined}
     */
    $scope.onOpenProfileAuthUser = function() {
        $location.path("/my_profile/").search({});
    };

    /**
     * Забираем список друзей из localStorage
     * @return {Array} [description]
     */
    $scope.guestFollowGetOnStorage = function() {
        var follows =  JSON.parse(localStorage.getItem('follows'));
        if(follows == null) {
            follows = [];
        }
        return follows;
    }

    /**
     * ID авторизованного пользователя
     * @type {[type]}
     */
    $scope.authUserId = AuthUser.get();

    /**
     * Массив всяких данных
     * @type {Object}
     */
    $scope.workspace = {};

    /**
     * Массив хренения списка друзей для не авторизованного пользователя
     * @type {[type]}
     */
    $scope.tmpFollows = $scope.guestFollowGetOnStorage();

    /**
     * получаем имя текущего контроллера
     * @type {[type]}
     */
    $scope.controller = $location.path().split("/").join("_");

    /**
     * События перехода по страницам
     * @param  {[type]}   event   [description]
     * @param  {Function} next    [description]
     * @param  {[type]}   current [description]
     * @return {[type]}           [description]
     */
    $scope.$on('$routeChangeStart', function(event, next, current) {
        $scope.controller = $location.path().split("/").join("_");

        // скрываем поиск
        $rootScope.$broadcast('hideSearch');
    });

    /**
     * Забираем список друзей для не зарегистрированного пользователя
     * @param  {[type]} $event  [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    $scope.$on('getTmpFollows', function($event, message) {
        $scope.tmpFollows = $scope.guestFollowGetOnStorage();
        $rootScope.$broadcast('getTmpFollowsCallback_');
    });

    $scope.$on('logout', function($event, message) {
        $scope.authUserId = null;
    });

    $scope.shareFacebook = function(url, title, descr, image) {
        var winWidth = 600;
        var winHeight = 600;
        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        return false;
    };

    $scope.shareGoogle = function(url) {
        var winWidth = 600;
        var winHeight = 600;
        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        window.open('https://plus.google.com/share?url='+ url, 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        return false;
    };

    /**
     * Выходим из системы
     * @return {[type]} [description]
     */
    $scope.onLogout = function() {
        AuthUser.logout();
    
        if(socialsAccess.facebook.isLoggined) {
            $facebook.logout();
            socialsAccess.facebook.isLoggined = false;  
        }

        if(socialsAccess.live.isLoggined) {
            WL.logout();
            socialsAccess.live.isLoggined = false;  
        }
        
        if(socialsAccess.googlePlus.isLoggined) {
            $.get("https://mail.google.com/mail/u/0/?logout&hl=en");  
            
            socialsAccess.googlePlus.isLoggined = false;  
        }
        
        $scope.workspace.user = null;
        $rootScope.$broadcast('logout');
        $rootScope.$broadcast('getTmpFollows');
        $location.path("/");
    }

    /**
     * Получаем данные по авторизаованному пользователю
     * @return {[type]} [description]
     */
    $scope.getUserInfo = function() {
        if($scope.authUserId) {
            User.query({id: $scope.authUserId}, function(data) {
                $scope.workspace.user = data;
                $scope.workspace.user.points = parseInt($scope.workspace.user.points);
                if(isNaN($scope.workspace.user.points)) {
                    $scope.workspace.user.points = 0;
                }

                User.get_friends({id: $scope.authUserId}, {}, function(frends) {
                   $scope.workspace.user.frends = frends;
                   $rootScope.$broadcast('authUserGetData');
                });
            });
        }
    };

    /**
     * Берем список needs
     * Если он есть в localstoreage то сначала оттуда
     * @return {[type]} [description]
     */
    $scope.getNeeds = function() {
        var needs = lscache.get("needs");
        if(!needs) {
            $scope.getNeedsOnServer_();
        } else {
            $scope.workspace.needs = needs;
            $rootScope.$broadcast('needsGet');
        }
        
    };

    /**
     * Забираем список нидсов с сервера
     * @return {[type]} [description]
     */
    $scope.getNeedsOnServer_ = function() {
        Needs.query({}, {}, function(data) {
            $scope.workspace.needs = data;
            lscache.set('needs', JSON.stringify(data), 1440);
            $rootScope.$broadcast('needsGet');
        });
    }


    $timeout(function() {
        $scope.getUserInfo();
        $scope.getNeeds();
        $scope.getCountries();
        $scope.getAllLeagues();
    }, 1000);


    $scope.getCountries = function() {
        States.query({}, {}, function(data) {
            $scope.workspace.countries = data;
        });    
    }

    /**
     * Забираем список всех лиг
     * @return {[type]} [description]
     */
    $scope.getAllLeagues = function() {
        /**
         * Забираем список всех лиг
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        Leagues.query({}, {}, function(data) {
            $scope.workspace.leagues = data;
        });
    }

    $scope.$on('reloadLeagues', function($event, message) {
        $scope.getAllLeagues();
    });
    
    $scope.$on('updateUserData', function($event, message) {
        if(message.user.sguid === $rootScope.authUserId) {
            $rootScope.workspace.user = message.user;
        }
    });

    $scope.$on('unfollow', function($event, message) {
        if($scope.authUserId) {
            $scope.authUnFollow(message);
        } else {
            $scope.guestUnFollow(message);
        }
    });

    $scope.$on('follow', function($event, message) {
        if($scope.authUserId) {
            $scope.authFollow(message);
        } else {
            $scope.guestFollow(message);
        }
    });

    $scope.authFollow = function(message) {
        User.create_friendship({id: message.userId}, {
            friend_guid: message.frendId
        }, function(response) {     
            if(response.success) {
                $scope.workspace.user.frends.push({sguid: response.message.guid, user: message.user});
                $rootScope.$broadcast('followCallback', {frendId: message.frendId});
            }
        });
    };

    $scope.guestFollow = function(message) {
        $scope.tmpFollows.push({sguid: null, user: message.user});
        $scope.guestFollowPersist();
        $rootScope.$broadcast('followCallback', {frendId: message.frendId});
    };

    $scope.guestFollowPersist = function() {
        localStorage.setItem('follows', JSON.stringify($scope.tmpFollows));
    }

    $scope.authUnFollow = function(message) {
        User.destroy_friendship({id: message.userId, friendId: message.frendId}, { }, function() {
            var frend = $scope.workspace.user.frends.filter(function(data) {
                if(data.user.sguid === message.frendId) {
                    return data;
                }
            })[0];
            var index = $scope.workspace.user.frends.indexOf(frend);
            $scope.workspace.user.frends.splice(index, 1);

            $rootScope.$broadcast('unfollowCallback', {frendId: message.frendId});
        });
    };

    $scope.guestUnFollow = function(message) {
        var frend = $scope.tmpFollows.filter(function(data) {
            if(data.user.sguid === message.frendId) {
                return data;
            }
        })[0];
        var index = $scope.tmpFollows.indexOf(frend);
        $scope.tmpFollows.splice(index, 1);
        $scope.guestFollowPersist();
        $rootScope.$broadcast('unfollowCallback', {frendId: message.frendId});
    };

    $scope.$on('onSignin', function($event, message) {
        if(message && message.sguid) {
            User.query({id: message.sguid}, function(data) {
                $scope.workspace.user = data;
                if(message.update) {
                    User.updateUser(
                        { "id": $scope.workspace.user.sguid },  
                        { user: JSON.stringify(message.update) }, 
                        function(data) {
                            if(message.update.name) {
                                $scope.workspace.user.name = message.update.name;
                            }
                        }
                    );
                }
                
                $scope.workspace.user.points = parseInt($scope.workspace.user.points);
                if(isNaN($scope.workspace.user.points)) {
                    $scope.workspace.user.points = 0;
                }

                AuthUser.set(message.sguid, message.token);

                if($scope.workspace.user.points == 0) {
                  $cookieStore.put("myProfileTab", 3);
                } else {
                  $cookieStore.put("myProfileTab", 1);
                }

                User.get_friends({id: message.sguid}, function(frends) {
                    $scope.workspace.user.frends = frends;
                    $scope.authUserId = data.sguid;

                    $rootScope.$broadcast('frendLoad');

                    if(message.isSocial) {
                        $rootScope.$broadcast('socialLogined');
                    }

                    if(!message.noRedirect) {
                        $location.path('/my_profile');
                    }
                });
            });    
        }
    });
    
    $scope.gplusAuth = function(email, name) {
        Social.login({}, {email: email}, function(data) {
            var updateUser = {};
            if(data.was_created) {
                updateUser["name"] = name;
            }

            $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true , update: updateUser, token: data.token});
            $rootScope.$broadcast('loaderHide');

        });
    };

    $scope.gplusFalse = function() {
        $rootScope.$broadcast('loaderHide');
    };

    /**
     * Список карьер
     * @type {Array}
     */
    $scope.careerList = [];

    /**
     * Показываем все елементы списка.
     * @param  {[type]} listName [description]
     * @return {[type]}          [description]
     */
    $scope.showAllListElement = function(listName) {
        angular.forEach($scope[listName], function(value, key){
            value.show = true;
        });
    }

    /**
     * Получаем список карьер когда загружены needs
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @param  {[type]} scope  [description]
     * @return {[type]}        [description]
     */
    $scope.$watch("workspace.needs", function (newVal, oldVal, scope) {
        if(newVal) {
            var needs = JSON.parse(JSON.stringify($scope.workspace.needs));
            var curNeed = needs.filter(function(value) {
                if(value.sguid == "169990243011789827") {
                    return value;
                }
            })[0];
            $scope.careerList = curNeed.goals.filter(function(value) {
                if(value.sguid != "170689401829983233") { return value }
            });
            $scope.showAllListElement("careerList");
        }
    });

    
}