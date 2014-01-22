function ChangePasswordController($scope, Sessions, User, $location, $rootScope, MailHash, $routeParams, Password, $window, $cookieStore) {
    $scope.form = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        email: "",
        code: ""
    }

    $scope.onChangePasswordCancel = function() {
        $scope.onBack();
    }

    $scope.onChangePasswordCancel2 = function() {
        $scope.state = 1;
    }

    $scope.message = 0;

    $scope.state = 1;

    $scope.userSguid = "";

    $scope.hash = "";

    $scope.isEmailNotFound = false;

    if($routeParams.hash) {
        $scope.hash = $routeParams.hash;
        $scope.state = 2;
    }

    $scope.onBack = function() {
        if($cookieStore.get("changePasswordOnUser")) {
            $location.path("/my_profile");
        } else {
            $location.path("/login");
        }

        $cookieStore.remove("changePasswordOnUser");
    }

    $scope.onChangePasswordChanged = function() {
        $scope.onBack();
    }

    $scope.onCancel = function() {
        $scope.onBack();
    }

    $scope.onChangePasswordOk = function() {
        $scope.message = 0;
        $scope.state = 2;
    }

    $scope.onChangePassword = function() {
        User.test_email({}, {email: $scope.form.email}, function(data) {
            if(data.success) {
                $scope.isEmailNotFound = false;
                MailHash.create({}, {
                    "email": $scope.form.email
                }, function(data) {
                    $scope.userSguid = data.guid;
                    $scope.message = 1;
                });
            } else {
                $scope.isEmailNotFound = true;
            }
        });
    }

    $scope.onChangePasswordBegin = function() {
        var user = {
            "password": $scope.form.newPassword,
            "email": $scope.form.email,
            "code": $scope.form.code
        }

        Password.update({},  user, function(data) {
                $scope.message = 3;
            }
        );
    }
}