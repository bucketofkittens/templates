/**
 * Контроллер страницы расширенного поиска
 * @param {[type]} $scope     [description]
 * @param {[type]} $location  [description]
 * @param {[type]} $rootScope [description]
 * @param {[type]} User       [description]
 */
function SearchAdvanceController($scope, $location, $rootScope, User, Professions, CityByState, Leagues, $timeout) {
    /**
     * Тект поиска
     * @type {[type]}
     */
    $scope.searchText = $location.search().text;

    /**
     * Модель данных расширенного поиска
     * @type {Object}
     */
    $scope.search = {
        career: {},
        profession: {},
        country: {},
        city: {},
        league: {},
        minScore: 0,
        maxScore: 100000
    };


    /**
     * Состояние выпадающих меню
     * @type {Object}
     */
    $scope.shows = {
        career: false,
        profession: false,
        country: false,
        city: false, 
        league: false
    }

    /**
     * Список профессий
     * @type {Object}
     */
    $scope.professionList = {};

    /**
     * Список городов
     * @type {Object}
     */
    $scope.cityList = {};

    /**
     * Список стран
     * @type {Object}
     */
    $scope.countriesList = {};

    /**
     * Скрывать все списоки при клике вне него
     * @todo по хорошему надо переписать!
     * @return {[type]} [description]
     */
    $("body").on("click", function(e) {
        if(!$(e.target).hasClass("searcher") && !$(e.target).hasClass("search")) {
            $scope.$apply(function() {
                $scope.shows = {
                    career: false,
                    profession: false,
                    country: false,
                    city: false, 
                    league: false
                }
            });  
        }
          
    });

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
     * Забираем список стран в переменную когда он загрузится в другом контроллере
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @param  {[type]} scope  [description]
     * @return {[type]}        [description]
     */
    $scope.$watch("workspace.countries", function (newVal, oldVal, scope) {
        if(newVal) {
            $scope.countriesList = newVal;
            $scope.showAllListElement('countriesList');
        }
    });

    /**
     * Событие изменения maxScore
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @param  {[type]} scope  [description]
     * @return {[type]}        [description]
     */
    $scope.$watch("search.minScore", function (newVal, oldVal, scope) {
        $scope.collapseLeague();
    });

    /**
     * Событие изменения maxScore
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @param  {[type]} scope  [description]
     * @return {[type]}        [description]
     */
    $scope.$watch("search.maxScore", function (newVal, oldVal, scope) {
        $scope.collapseLeague();
    });

    /**
     * Скидываем лигу
     * @return {[type]} [description]
     */
    $scope.collapseLeague = function() {
        $scope.search.league = {};
    }

    /**
     * Метод очищает все текущие выбранные значения в форме
     * @return {[type]} [description]
     */
    $scope.clearAll = function() {
        $scope.search = {
            career: {},
            profession: {},
            country: {},
            city: {},
            league: {}
        };

        $scope.shows = {
            career: false,
            profession: false,
            country: false,
            city: false, 
            league: false
        }
    }

    /**
     * В модель расширенного поиска передаем новые данные выбранные из выпадающего списка
     * @param  {[type]} paramName [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    $scope.selectParam = function(paramName, value, isNotToggle) {
        $scope.search[paramName] = value;
        if(!isNotToggle) {
            $scope.toggleShowState(paramName);   
        }
    }

    /**
     * Указывает новую лигу
     * @param  {[type]}  paramName   [description]
     * @param  {[type]}  value       [description]
     * @param  {Boolean} isNotToggle [description]
     * @return {[type]}              [description]
     */
    $scope.selectLeagueParam = function(paramName, value, isNotToggle) {

        var leagueName = 10 - parseInt(value.name);
        $scope.search.minScore = leagueName*10000;
        $scope.search.maxScore = (leagueName+1)*10000;

        $timeout(function(){
            $scope.selectParam(paramName, value);
            $scope.disableShowState(paramName);
        }, 0);
    }

    /**
     * Меняем постояние параметра param на обратное
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */ 
    $scope.toggleShowState = function(param) {
        $scope.shows[param] = $scope.shows[param] ? false : true;
    }

    /**
     * Показываем выпадающий спслк
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    $scope.enableShowState = function(param) {
        $scope.shows[param] = true;
    }

    /**
     * Убираем выпадающий спслк
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    $scope.disableShowState = function(param) {
        $scope.shows[param] = false;
    }

    /**
     * Изменяем карьеру
     * @param  {[type]} paramName [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    $scope.selectCareerParam = function(paramName, value) {
        $scope.selectParam(paramName, value);
        $scope.getProfessionByCareer_(value.sguid, $scope.getProfessionByCareerCallback_);

        // очищаем профессию если сменилась карьера
        $scope.selectParam("profession", "");
        $scope.toggleShowState("profession");
    }

    /**
     * Изменяем карьеру
     * @param  {[type]} paramName [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
    $scope.selectContryParam = function(paramName, value) {
        $scope.selectParam(paramName, value);
        $scope.getCityByContry_(value.sguid, $scope.getCityByContryCallback_);

        // очищаем город если сменилась страна
        $scope.selectParam("city", "");
        $scope.toggleShowState("city");
    }

    /**
     * Получаем список профессий для текущей карьеры
     * @param  {[type]} careerId  [description]
     * @param  {[type]} callback_ [description]
     * @return {[type]}           [description]
     */
    $scope.getProfessionByCareer_ = function(careerId, callback_) {
        Professions.query({ id: careerId }, {}, callback_);
    }

    /**
     * callback после получения списка профессий для текущей карьеры
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.getProfessionByCareerCallback_ = function(data) {
        $scope.professionList = data;
        $scope.showAllListElement('professionList');
    }

    /**
     * Получаем список профессий для текущей карьеры
     * @param  {[type]} careerId  [description]
     * @param  {[type]} callback_ [description]
     * @return {[type]}           [description]
     */
    $scope.getCityByContry_ = function(contryId, callback_) {
        CityByState.query({ id: contryId }, {}, callback_);
    }

    /**
     * callback после получения списка профессий для текущей карьеры
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.getCityByContryCallback_ = function(data) {
        $scope.cityList = data;
        $scope.showAllListElement('cityList');
    }

    /**
     * Транслирует модель параметров в тот вид что нужен backend-у
     * @return {[type]} [description]
     */
    $scope.translateParamsToServer_ = function() {
        var params = {};
        if($scope.search.career && $scope.search.career.sguid) {
            params["career_goal_guid"] = $scope.search.career.sguid;
        }
        if($scope.search.country && $scope.search.country.sguid) {
            params["state_guid"] = $scope.search.country.sguid;
        }
        if($scope.search.city && $scope.search.city.sguid) {
            params["city_guid"] = $scope.search.city.sguid;
        }
        if($scope.search.profession && $scope.search.profession.sguid) {
            params["profession_guid"] = $scope.search.profession.sguid;
        }
        if($scope.search.league && $scope.search.league.sguid) {
            params["league_guid"] = $scope.search.league.sguid;
        }
        if($scope.search.birthday_from) {
            params["birthday_from"] = moment($scope.search.birthday_from).format("DD/MM/YYYY");
        }
        if($scope.search.birthday_till) {
            params["birthday_till"] = moment($scope.search.birthday_till).format("DD/MM/YYYY");
        }
        if($scope.search.minScore) {
            params["points_from"] = $scope.search.minScore;
        }
        if($scope.search.maxScore) {
            params["points_till"] = $scope.search.maxScore;
        }
        if($scope.searchText) {
            params["name"] = $scope.searchText;
        }

        return params;
    }

    /**
     * Функция расширенного поиска
     * @return {[type]} [description]
     */
    $scope.advanceSearch = function() {
        $rootScope.$broadcast('loaderShow');

        User.search({}, $scope.translateParamsToServer_(), $scope.advanceSearchCallback_);
    }

    /**
     * Callback для поиска
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.advanceSearchCallback_ = function(data) {
        $rootScope.$broadcast('loaderHide');
        $rootScope.$broadcast('updateSearchList', {id: "adv", data: data});
    }

    /**
     * Параметры календарей
     * @type {Object}
     */
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0',
        dateFormat: 'dd/mm/yy',
        showOn: 'button'
    };

    /**
     * Событие изменения в поле поиска текста
     * @param  {[type]} $event  [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    $scope.$on('updateSearchText', function($event, message) {
        $scope.searchText = message.text;
    });

    /**
     * Фильтрует и показывает указанный выпадающий список
     * @param  {[type]} listName [description]
     * @return {[type]}          [description]
     */
    $scope.filteredList = function(listName, filteredText, showParam) {
        var countView = 0;
        if($scope[listName].length > 0 && filteredText.length > 0) {
            angular.forEach($scope[listName], function(value, key) {
                var reg = new RegExp(filteredText, "i");
                if(reg.test(value.name)) {
                    $scope.enableShowState(showParam);
                    value.show = true;
                    countView += 1;
                } else {
                    value.show = false;
                }
            });
            if(countView == 0) {
                $scope.disableShowState(showParam);
            }
        } else {
            $scope.showAllListElement(listName);
            $scope.disableShowState(showParam);
        }
    }
}