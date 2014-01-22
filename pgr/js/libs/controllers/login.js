/**
 * форма модального окна авторизации
 * @param {[type]} $scope [description]
 */
function LoginController($scope, Sessions, $rootScope, User, Social, $facebook, $location, $window, ImprovaLogin, $routeParams) {
    $scope.show = false;
    $scope.improva = 0;

    $scope.signup = false;
    $scope.captha = "";

    $scope.login = {
        login: "",
        password: ""
    }

    $scope.improvaForm = {
        login: "",
        password: ""
    }

    $scope.user = {
        login: "",
        email: "",
        password: ""
    }

    $scope.user_create = 0;

    $scope.$on('openLoginModal', function() {
        $scope.show = true;
    });

    $scope.$on('hideModal', function() {
        $scope.show = false;
    });

    $scope.improvaError = "";

    $scope.$on('socialLogined', function() {
    });

    $scope.onSuccessRegistration = 0;

    if($routeParams.onSuccess) {
        $scope.onSuccessRegistration = 1;
    }

    $scope.onCancelSuccess = function() {
        $scope.onSuccessRegistration = 0;
    }

    $scope.onCancelCreate = function() {
        $scope.user_create = 0;
        $location.path("/login/");
    }

    $scope.onSignStateChange = function() {
        $scope.signup = $scope.signup ? false : true;
        if($scope.signup) {
            $location.search({signup: true});
        } else {
            $location.search({signup: false});
        }
    }

    if($location.search().signup == true) {
        $scope.signup = true;
    }

    $rootScope.$on('$locationChangeSuccess', function(event){
        if($location.search().signup == true) {
            $scope.signup = true;
        } else {
            $scope.signup = false;
        }
    });

    $scope.improvaLogin = function() {
        $scope.improva = 1;
    }

    $scope.onCancelImprova = function() {
        $scope.improva = 0;
    }

    $scope.onImprovaSign = function() {
        $rootScope.$broadcast('loaderShow');

        /**
         * Проверяем есть ли такой пользователь в improva
         * @param  {[type]} dataImprova [description]
         * @return {[type]}             [description]
         */
        ImprovaLogin.isset({}, {email: $scope.improvaForm.email, password: $scope.improvaForm.password}, function(dataImprova) {
            if(!dataImprova.authorized) {
                $scope.improvaError = "No user";
                $rootScope.$broadcast('loaderHide');
            } else {
                /**
                 * Если пользователь пытаемся авторизироваться
                 * @param  {[type]}
                 * @param  {[type]}
                 * @return {[type]}
                 */
                Sessions.signin({}, $.param({
                    "email": dataImprova.email,
                    "password": "",
                    "from_improva": "1"
                }), function(data) {
                    if(data.success) {
                        /**
                         * Отправляю событие на авторизацию пользователя
                         * @type {[type]}
                         */

                        $rootScope.$broadcast('onSignin', {sguid: data.guid, token: data.token});
                        $rootScope.$broadcast('loaderHide');
                    } else {
                        /**
                         * Если пользователя нет, тогда создаем его основывваясь на данных из импурвы
                         * @return {[type]} [description]
                         */
                        User.create(
                            {user: JSON.stringify({
                                "login": dataImprova.email,
                                "email": dataImprova.email,
                                "name": dataImprova.email,
                                "password": "",
                                "confirmed": "1"
                            })}
                            ,function(data) {
                                if(data.success) {
                                    var user = {}

                                    if(dataImprova.name) {
                                        user["name"] = dataImprova.name;
                                    }
                                    if(dataImprova.birthday) {
                                        user["birthday"] = dataImprova.birthday;
                                    }

                                    /**
                                     * Обновляем данные пользователя зашедшего через импуру первый раз
                                     * @param  {[type]} data [description]
                                     * @return {[type]}      [description]
                                     */
                                    User.updateUser({"id": data.message.guid},  {user: JSON.stringify(user)}, function(data) {
                                            Sessions.signin({}, $.param({
                                                "email": dataImprova.email,
                                                "password": ""
                                            }), function(data) {
                                                if(data.success) {
                                                    $rootScope.$broadcast('onSignin', {sguid: data.guid, token: data.token});
                                                    $rootScope.$broadcast('loaderHide');
                                                }
                                            });
                                        }
                                    );
                                    
                                } else {
                                    $rootScope.$broadcast('loaderHide');
                                }
                            }
                        );
                    }
                });
            }
        });
    }

    /**
     * Вызывается при нажатии ok в форме авторизации
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onSingin = function(data) {
        Sessions.signin({}, $.param({
            "email": $scope.login.email,
            "password": $scope.login.password
        }), function(data) {
            if(data.success) {
                $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true, token: data.token});
                $scope.show = false;
            } else {
                $scope.error = data.message;
            }
        });
    }

    $scope.onKeyPress = function($event) {
        if(!$scope.LoginForm.$invalid) {
            $scope.onSingin();
        }
    }

    $scope.onKeyPressReg = function($event) {
        if(!$scope.RegForm.$invalid) {
            $scope.onAddUser();
        }
    }

    $scope.errorValidate = "";

    /**
     * 
     * @param {type} $event
     * @returns {undefined}
     */
    $scope.onAddUser = function ($event) {
        $rootScope.$broadcast('loaderShow');

        var phpquery = $.ajax({url:"test.php",
          type: "POST",
          async: false,
          data:{recaptcha_challenge_field:Recaptcha.get_challenge(),recaptcha_response_field:Recaptcha.get_response()},
          success:function(resp) {
            if(resp == "0") {
                $scope.errorValidate = "Text invalid";
                $rootScope.$broadcast('loaderHide');
            } else {
                User.create(
                    {user: JSON.stringify({
                        "name": $scope.user.email.split("@")[0],
                        "login": $scope.user.email,
                        "email": $scope.user.email,
                        "password": $scope.user.password
                    })}
                    ,function(data) {
                        $rootScope.$broadcast('loaderHide');
                        if(!data.success) {
                            $scope.errors = "";
                            $scope.errorEmail = "";
                            angular.forEach(data.errors, function(value, key) {
                                if(value && value == 'login: ["is already taken"]') {
                                    $scope.errorEmail = "Exists specified email.";
                                }
                            });
                        } else {
                            $scope.user_create = 1;
                        }
                    }
                );
            }
          }
        });
    }
    

    /**
     * 
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.regiostrationOpen = function($event) {
        $rootScope.$broadcast('registrationModalShow');
    }

    $scope.socialFacebookLogin = function() {
        FB.login(function(response) {
            if(!response.authResponse) {
                $scope.$apply(function() {
                    $rootScope.$broadcast('loaderHide');
                });
            }
        }, { scope: 'email' });
    };

    $scope.socialGooglePlusLogin = function() {
        gapi.auth.authorize({
            client_id: socialsAccess.googlePlus.applicationId[window.location.hostname], 
            scope: socialsAccess.googlePlus.scopes, 
            immediate: false
        }, handleAuthResult);
    };

    $scope.socialMicrosoftLiveLogin = function() {
        WL.login({
            scope: ["wl.signin", "wl.basic", "wl.emails", "wl.birthday"]
        }).then(
            function (session) {
                WL.api({
                    path: "me",
                    method: "GET"
                }, function(dataWL) {
                    Social.login({}, {email: dataWL.emails.account}, function(data) {
                        var updateUser = {};
                        if(data.was_created) {
                            updateUser["name"] = dataWL.first_name;
                            if(dataWL.last_name) {
                                updateUser["name"] = updateUser["name"]+" "+dataWL.last_name;
                            }
                            if(dataWL.birth_day) {
                                updateUser["birthday"] = dataWL.birth_day+"/"+dataWL.birth_month+"/"+dataWL.birth_year;
                            }
                        }
                        $rootScope.$broadcast('onSignin', {
                            sguid: data.guid, 
                            isSocial: true,
                            update: updateUser, 
                            token: data.token
                        });
                        $rootScope.$broadcast('loaderHide');
                        socialsAccess.live.isLoggined = true;
                    });
                });
            },
            function (sessionError) {
                Social.login({}, {email: response.email}, function(data) {
                    $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true, token: data.token});
                    $rootScope.$broadcast('loaderHide');
                    socialsAccess.facebook.isLoggined = true;
                });
            }
        );
    };

    $scope.$on('fb.auth.authResponseChange', function(data, d) {
        FB.api('/me', {fields: 'name,id,location,birthday,email'}, function(response) {
            Social.login({}, {email: response.email}, function(data) {
                var updateUser = {};

                if(data.was_created) {
                    updateUser["name"] = response.name;
                }
                
                $rootScope.$broadcast('onSignin', {
                    sguid: data.guid, 
                    isSocial: true, 
                    update: updateUser, 
                    token: data.token
                });
                $rootScope.$broadcast('loaderHide');
                socialsAccess.facebook.isLoggined = true;
            });
        });
    });
}