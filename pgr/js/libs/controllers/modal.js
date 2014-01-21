/**
 * Контроллер страницы модальных окошек
 * @param {[type]} $scope [description]
 */
function ModalController($scope, $rootScope) {
	$scope.template = null;
	
	$scope.$on('openModal', function(event, message) {
		$rootScope.$broadcast('showShadow');
        $scope.template = message.name;
        $scope.show = true;
    });

    $scope.$on('closeModal', function(event, message) {
		$scope.closeModal();
    });

    $scope.closeModal = function() {
    	$scope.template = null;
        $scope.show = false;
    }
}