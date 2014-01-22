function MyProfileController($scope, $rootScope, User, $location, $cookieStore, Professions, ProfessionCreate, City, States, CityByState) {
    $scope.tab = 2;
    $scope.curNeed = null;
    $scope.curProff = [];
    $scope.curState = [];
    $scope.showProf = false;
    $scope.showProf2 = false;
    $scope.showState = false;
    $scope.showState2 = false;
    $scope.isAddState = false;
    $scope.career = null;
    $scope.isAddProff = false;
    $scope.states = [];
    $scope.state = null;
    $scope.countCareerChange = 0;
    $scope.countCityChange = 0;

    /**
     * Имена всех пользователей
     * @type {Array}
     */
    $scope.names = [];

    /**
     * Список имен отображаемый
     * @type {Array}
     */
    $scope.showedNames = [];

    /**
     * Показываем или нет список имен пользователей
     * @type {Boolean}
     */
    $scope.isShowNames = false;

    $("body").on("click", function() {
        $scope.$apply(function() {
            $scope.showProf2 = false;
            $scope.showState2 = false;
            $scope.showedNames = [];
        });
    });

    /**
     * Забираем имена всех пользователей
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.getAllNames = function($event) {
        User.get_names({}, {}, function(data) {
            $scope.names = JSON.parse(data.message);
        });
    }

    /**
     * Проверяем вхождение введенного имени в списке имен
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.testUserNames_ = function($event) {
        
    }

    $scope.selectCareer = function($event, career) {
        if(career) {
            Professions.query({ id: career.sguid }, {}, function(data) {
                $scope.showProf = true;
                $scope.curProff = data;
                $scope.career = career;

                if($scope.countCareerChange != 0) {
                    $scope.workspace.user.profession = {};
                }

                $scope.countCareerChange += 1;
            });    
        }
    }

    $scope.selectCityByState = function($event, state) {
        if(state) {
            CityByState.query({ id: state.sguid }, {}, function(data) {
                $scope.showState = true;
                $scope.curState = data;
                $scope.state = state;

                if($scope.countCityChange != 0) {
                    $scope.workspace.user.city = {};
                }

                $scope.countCityChange += 1;
            });    
        }
    }

    $scope.selectCity = function($event) {
        City.query({}, {}, function(data) {
            $scope.showState = true;
            $scope.curState = data;
        });
    }

    $scope.getStates = function($event) {
        States.query({}, {}, function(data) {
            $scope.showState = true;
            $scope.states = data;
        });    
    }

    $scope.getStates();
    $scope.selectCity();
    $scope.getAllNames();

    $scope.deleteItem = function($event, item, key) {
        ProfessionCreate.del({id: item.sguid}, {}, function(data) {
            $scope.curProff.splice(key, 1);
        });
    }

    $scope.deleteCityItem = function($event, item, key) {
        City.del({id: item.sguid}, {}, function(data) {
            $scope.curState.splice(key, 1);
        });
    }

    $scope.selectCurrentProfession = function($event, item, key) {
        $scope.showProf2 = false;
        $scope.isAddProff = false;
        $scope.workspace.user.profession.name = item.name;
        $scope.workspace.user.profession.sguid = item.sguid;
        $scope.onPublish();    
    }

    $scope.selectCurrentCity = function($event, item, key) {
        $scope.showState2 = false;
        $scope.isAddState = false;
        $scope.workspace.user.city.name = item.name;
        $scope.workspace.user.city.sguid = item.sguid;
        $scope.onPublish();    
    }

    $scope.selectProfession = function($event) {
        var countShow = 0;
        var proffisset = false;

        if($scope.workspace.user.profession.name.length > 0) {
            angular.forEach($scope.curProff, function(value, key) {
                var reg = new RegExp($scope.workspace.user.profession.name, "i");
                if(reg.test(value.name)) {
                    countShow += 1;
                    value.show = true;
                } else {
                    value.show = false;
                }
                if(value.name == $scope.workspace.user.profession.name) {
                    $scope.isAddProff = false;
                    proffisset = true;
                }
            });    
        } else {
            $scope.showProf2 = false;
            $scope.isAddProff = false;
        }
        

        if(!proffisset) {
            $scope.isAddProff = true;
        }

        if(countShow > 0) {
            $scope.showProf2 = true;
        } else {
            $scope.showProf2 = false;
            $scope.isAddProff = true;
        }

        if($scope.workspace.user.profession.name.length == 0) {
            $scope.isAddProff = false;
        }
    }

    $scope.testCity = function($event) {
        var countShow = 0;
        var proffisset = false;

        if($scope.workspace.user.city.name.length > 0) {
            angular.forEach($scope.curState, function(value, key) {
                var reg = new RegExp($scope.workspace.user.city.name, "i");
                if(reg.test(value.name)) {
                    countShow += 1;
                    value.show = true;
                } else {
                    value.show = false;
                }
                if(value.name == $scope.workspace.user.city.name) {
                    $scope.isAddState = false;
                    proffisset = true;
                }
            });    
        } else {
            $scope.showState2 = false;
        }
        

        if(!proffisset) {
            $scope.isAddState = true;
        }
        if(countShow > 0) {
            $scope.showState2 = true;
        } else {
            $scope.showState2 = false;
            $scope.isAddState = true;
        }

        if($scope.workspace.user.city.name.length == 0) {
            $scope.isAddState = false;
        }
    }

    $scope.addProfession = function($event) {
        ProfessionCreate.create({}, {
            "profession": { 
                name: $scope.workspace.user.profession.name 
            },
            "goal_guid": $scope.career.sguid
        }, function(data) {
            $scope.workspace.user.profession.name = data.message.name;
            $scope.workspace.user.profession.sguid = data.message.guid;
            $scope.onPublish();
            Professions.query({ id: $scope.career.sguid }, {}, function(data) {
                $scope.curProff = data;
                $scope.isAddProff = false;
            });
        });

        return false;
    }

    $scope.addCity = function($event) {
        City.create({}, {
            "city": { 
                name: $scope.workspace.user.city.name
            },
            "state_guid": $scope.state.sguid
        }, function(data) {
            $scope.workspace.user.city.name = data.message.name;
            $scope.workspace.user.city.sguid = data.message.guid;
            $scope.onPublish();
            City.query({}, {}, function(data) {
                $scope.curState = data;
                $scope.isAddState = false;
            });
        });

        return false;
    }

    if($cookieStore.get("myProfileTab")) {
        $scope.tab = $cookieStore.get("myProfileTab");    
    }

    /**
     * Проверка изменения даты рождения
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @param  {[type]} scope  [description]
     * @return {[type]}        [description]
     */
    $scope.$watch("workspace.user.birthday", function (newVal, oldVal, scope) {
        if(newVal) {
            $scope.workspace.user.birthdayDate = moment(newVal).toDate();
        }
    });

    $scope.$watch("workspace.user.profession", function (newVal, oldVal, scope) {
        if($scope.workspace.user && $scope.workspace.user.profession && $scope.curNeed) {
            if($scope.workspace.user.profession.goal_sguid) {
                $scope.career = $scope.curNeed.goals.filter(function(value) {
                    if(newVal.goal_sguid == value.sguid) {
                        return value;
                    }
                })[0];
                $scope.selectCareer({}, $scope.career);
                $scope.showProf = true;    
            }
        }
    });

    $scope.$watch("workspace.user.state", function (newVal, oldVal, scope) {
        if($scope.workspace.user && $scope.workspace.user.state && $scope.states.length > 0) {
            angular.forEach($scope.states, function(value, key){
                if(value.sguid == $scope.workspace.user.state.sguid) {
                    $scope.state = value;
                }
            });
            $scope.selectCityByState({}, $scope.state);
            $scope.showState = true;
        }
    });

    $scope.$watch("workspace.user", function (newVal, oldVal, scope) {
        if($scope.workspace.user && !$scope.workspace.user.profession && $scope.curNeed) {
            $scope.career = $scope.curNeed.goals[1];
            $scope.selectCareer({}, $scope.career);
        }

        if($scope.workspace.user && !$scope.workspace.user.city && $scope.states.length > 0) {
            $scope.setDefaultState();
        }
    });

    $scope.setDefaultState = function() {
        angular.forEach($scope.states, function(value, key){
            if(value.sguid == "459827700832404777") {
                $scope.state = value;
            }
        });
        $scope.selectCityByState({}, $scope.state);
    }

    $scope.$watch("states", function (newVal, oldVal, scope) {
        if($scope.workspace.user && !$scope.workspace.user.city && $scope.states.length > 0) {
            $scope.setDefaultState();
        }
        if($scope.workspace.user && $scope.workspace.user.city && $scope.workspace.user.state && $scope.states.length > 0) {
            angular.forEach($scope.states, function(value, key){
                if(value.sguid == $scope.workspace.user.state.sguid) {
                    $scope.state = value;
                }
            });
            $scope.selectCityByState({}, $scope.state);
            $scope.showState = true;
        }
    });

    $scope.$watch("workspace.needs", function (newVal, oldVal, scope) {
        if($scope.workspace.needs) {

            var needs = JSON.parse(JSON.stringify($scope.workspace.needs)); ;
            $scope.curNeed = needs.filter(function(value) {
                if(value.sguid == "169990243011789827") {
                    return value;
                }
            })[0];
            $scope.curNeed.goals = $scope.curNeed.goals.filter(function(value) {
                if(value.sguid != "170689401829983233") { return value }
            });

            if($scope.workspace.user && $scope.workspace.user.profession) {
                $scope.career = $scope.curNeed.goals.filter(function(value) {
                    if($scope.workspace.user.profession.goal_sguid == value.sguid) {
                        return value;
                    }
                })[0];
                $scope.selectCareer({}, $scope.career);
                $scope.showProf = true;
            }
            if($scope.workspace.user && !$scope.workspace.user.profession) {
                $scope.career = $scope.curNeed.goals[1];
                $scope.selectCareer({}, $scope.career);
            }
        }
    });

    $scope.$watch("workspace.user.birthdayDate", function (newVal, oldVal, scope) {
        if(oldVal && newVal) {
            $scope.onPublish();
        }
    });

    $scope.$watch("workspace.user.name", function (newVal, oldVal, scope) {
        $scope.showedNames = [];

        if($scope.workspace.user && $scope.workspace.user.name && $scope.workspace.user.name.length > 0) {
            var reg = new RegExp($scope.workspace.user.name, "i");
            angular.forEach($scope.names, function(value, key) {
                if(value && reg.test(value)) {
                    $scope.showedNames.push(value);
                }
            });    
        }
        if(oldVal && newVal) {
            $scope.onPublish();
        }
    });

    $scope.$on('criteriaOpened', function($event) {
       $("#content .tab .mypro_wr .mypro").scrollTop(0);
    });

    $scope.nameIsError = false;

    /**
     * Публикация профиля
     * Пока не работает нет backend
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onPublish = function($event) {
        if(!$scope.workspace.user.published) {
            $scope.workspace.user.published = 0;
        }

        var birthday = $scope.workspace.user.birthday;
        if($scope.workspace.user.birthdayDate) {
            var birthday = moment($scope.workspace.user.birthdayDate).format("DD/MM/YYYY");
        } 

        var user = {
                "login": $scope.workspace.user.login,
                "email": $scope.workspace.user.email
        }

        if($scope.workspace.user.name) {
            user["name"] = $scope.workspace.user.name;
        }

        if($scope.state) {
            user["state"] = $scope.state.sguid;
        }

        if($scope.workspace.user.city) {
            user["city"] = $scope.workspace.user.city.sguid;
        }

        if(birthday) {
            user["birthday"] = birthday;
        }

        if($scope.workspace.user.profession) {
            user["profession"] = $scope.workspace.user.profession.sguid;
        }

        User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                if(data.success) {
                    $scope.nameIsError = false;
                } else {
                    var isName = false;
                    angular.forEach(data.errors, function(value, key){
                        if(value == 'name: ["is already taken"]') {
                            isName = true;
                        }
                    });
                    if(isName) {
                        $scope.nameIsError = true;
                    } else {
                        $scope.nameIsError = false;
                    }
                }
            }
        );
    }

    /**
     * Публикация профиля
     * Пока не работает нет backend
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onUnPublish = function($event) {
        var user = {
            "published": 0
        }

        User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                $scope.workspace.user.published = 0;
                $rootScope.$broadcast('updatePubliched');
            }
        );
    }

    /**
     * Публикация профиля
     * Пока не работает нет backend
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onOnPublish = function($event) {
        var user = {
            "published": 1
        }

        User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                $scope.workspace.user.published = 1;
                $rootScope.$broadcast('updatePubliched');
            }
        );
    }

    $scope.onChangeEmail = function() {
        $location.path("/change_email"); 
    }

    $scope.onChangePassword = function() {
        $cookieStore.put("changePasswordOnUser", "1");
        $location.path("/change_password");
    }

    $scope.$watch("workspace.user.points", function (newVal, oldVal, scope) {
        if($scope.workspace.user && $scope.workspace.user.sguid && !$scope.workspace.user.league) {
            $scope.workspace.user.league = {};
            $scope.workspace.user.league.name = "10";
        }
    });

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };

    $scope.onChange = function(tab) {
        $scope.tab = tab;
        $cookieStore.put("myProfileTab", tab);
    }
}