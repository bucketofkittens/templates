/**
 * 
 * @param {[type]} $scope [description]
 */
function CompareController($scope, $location) {
    var needsCountLoaded = 0;
    var needsValues = {};
    var goalsCountLoaded = 0;
    var goalsValues = {};
    var crtiterias = {};
    var pointsCountLoaded = 0;
    var pointsValues = {};

    /*
    $scope.$on('getSelectedUserData', function($event, message) {
      pointsCountLoaded += 1;
      pointsValues[message.user.sguid] = message.user.points;
      if(pointsCountLoaded == 2) {
          var containers =  $("#content .pmain");
          containers.find(".du").remove();
          if(pointsValues[$location.search().user2] > pointsValues[$location.search().user1]) {
            containers.eq(1).append('<sup class="du"></sup>');
          }
          if(pointsValues[$location.search().user2] < pointsValues[$location.search().user1]) {
            containers.eq(0).append('<sup class="du"></sup>');
          }
          pointsCountLoaded = 1;
      }
    });
    */

    $scope.$on('needUserValueLoaded', function($event, message) {
      needsCountLoaded += 1;
      needsValues[message.userId] = message.needsValues;
      if(needsCountLoaded == 2) {
          angular.forEach(needsValues[$location.search().user2], function(value, key){
                $("li[data-needId='"+key+"'] .cr sup", $("#compare1")).remove();
                $("li[data-needId='"+key+"'] .cr sub", $("#compare2")).remove();

                if(value < needsValues[$location.search().user1][key]) {
                  $("li[data-needId='"+key+"'] .cr", $("#compare1")).append('<sup class="du dubidu"></sup>');
                } 
                if(value > needsValues[$location.search().user1][key]) {
                  $("li[data-needId='"+key+"'] .cr", $("#compare2")).append(' <sub class="du dubidu"></sub>');
                } 
          });
          needsCountLoaded = 1;
      }
    });

    $scope.$on('criteriaUserValueLoaded', function($event, message) {
      if(!crtiterias[message.fCriteria.sguid]) {
          crtiterias[message.fCriteria.sguid] = {};
      }
      var fCriterium = message.fCriteria;
      var fCriteriumValue = fCriterium.criteria_values.filter(function(value) {
          return value.sguid == fCriterium.user_criteria_sguid;
      })[0];

      crtiterias[message.fCriteria.sguid][message.userId] = fCriteriumValue;
      if(crtiterias[message.fCriteria.sguid][$location.search().user1] && crtiterias[message.fCriteria.sguid][$location.search().user2]) {
          var rootCriteria = crtiterias[message.fCriteria.sguid][$location.search().user2];
          var authCriteria = crtiterias[message.fCriteria.sguid][$location.search().user1];

          $("li[data-needId='"+fCriterium.sguid+"'] .cr sup", $("#compare1")).remove();
          $("li[data-needId='"+fCriterium.sguid+"'] .cr sub", $("#compare2")).remove();

          if(rootCriteria.value < authCriteria.value) {
             $("li[data-id='"+fCriterium.sguid+"']", $("#compare1")).append('<sup class="du bidubi"></sup>');
          }
          if(rootCriteria.value > authCriteria.value) {
             $("li[data-id='"+fCriterium.sguid+"']", $("#compare2")).append(' <sub class="du bidubi"></sub>');
          }
      }
    });

    $scope.$on('goalUserValueLoaded', function($event, message) {
        goalsCountLoaded += 1;
        goalsValues[message.userId] = message.goalsValues;
        if(goalsCountLoaded == 2) {
          angular.forEach(goalsValues[$location.search().user2], function(value, key) {
             $("li[data-needId='"+key+"'] .cr sup", $("#compare1")).remove();
             $("li[data-needId='"+key+"'] .cr sub", $("#compare2")).remove();

             if(value < goalsValues[$location.search().user1][key]) {
                $("li[data-goalid='"+key+"'] > h5", $("#compare1")).append(' <sup class="du"></sup>');
             } 
             if(value > goalsValues[$location.search().user1][key]) {
                $("li[data-goalid='"+key+"'] > h5", $("#compare2")).append('<sub class="du"></sub>');
             } 
          });
          goalsCountLoaded = 1;
      }
    });
}