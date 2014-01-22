/**
 * Костратолка картинок
 * @param {[type]} $scope     [description]
 * @param {[type]} $rootScope [description]
 */
function CropImageController($scope, $rootScope) {
    $scope.user = [];
    $scope.positions = [];
    $scope.imageData = '';
    $scope.show = false;
    $scope.jcrop = null;

    $scope.$on('cropImage', function($event) {
        $rootScope.$broadcast('loaderShow');
        $scope.user = $scope.workspace.user;
        $scope.show = true;
        $("#crop_modal").show();
        $scope.onReadFile();
    });

    $scope.$on('cropImageClose', function($event) {
        $scope.close();
    });

    $scope.close = function() {
        $scope.show = false;
        $("#crop_modal").hide();
    }

    $scope.onSend = function() {
        $rootScope.$broadcast('loaderShow');
        var crop_img = $("#crop_img");
        var canvas = document.getElementById("image_canvas");
        
        var ctx = canvas.getContext("2d");
        var image = new Image();
        image.src = $scope.imageData;
        image.onload = function() {
            var naturalWidth = image.width;
            var naturalHeight = image.height;
            var cropWidth = crop_img.width();
            var cropHeight = crop_img.height();

            $scope.positions.x = naturalWidth/cropWidth*$scope.positions.x;
            $scope.positions.y = naturalHeight/cropHeight*$scope.positions.y;
            $scope.positions.w = naturalWidth/cropWidth*$scope.positions.w;
            $scope.positions.h = naturalHeight/cropHeight*$scope.positions.h;

            $(canvas).attr("width",$scope.positions.w);
            $(canvas).attr("height",$scope.positions.h);

            ctx.drawImage(image, $scope.positions.x, $scope.positions.y, $scope.positions.w, $scope.positions.h, 0 , 0, $scope.positions.w, $scope.positions.h);
            var img = canvas.toDataURL("image/png");

            var data = new FormData();
            data.append("picture", img);
            data.append("owner_type", 0);

            var token = getCookie('token') ? getCookie('token') : "";
            var user = getCookie('user') ? getCookie('user') : "";

            $.ajax({
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("AUTH_TOKEN",token.split('"').join(""));
                    xhrObj.setRequestHeader("REMOTE_USER",user.split('"').join(""));
                },
                url: host+'/pictures/'+$scope.user.sguid,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'PUT'
            }).done(function(data) {
                $scope.$apply(function(){
                    if(data.success) {
                        $scope.workspace.user.avatar = data.message.scheme+"://"+data.message.host+data.message.path;
                        $scope.close();
                    }
                    $rootScope.$broadcast('loaderHide');
                    $scope.shouldBeOpen = false; 
                });
            });
        };
    }

    /**
     * [onReadFile description]
     * @param  {[type]} $event
     * @return {[type]}
     */
    $scope.onReadFile = function($event) {
        var file = document.getElementById("photo_crop").files[0];
        var reader = new FileReader();
        var positions = [];
        
        reader.onload = function(data) {
            var crop_img = $("#crop_img");
            $scope.imageData = data.target.result;
            $(crop_img).attr("src", data.target.result);
            $rootScope.$broadcast('loaderHide');
            if($scope.jcrop) {
                $scope.jcrop.data('Jcrop').destroy();
            }
            $scope.jcrop = crop_img.Jcrop({boxWidth: 500, boxHeight: 500 , minSize: [200, 200], aspectRatio: 1, setSelect: [0, 0, 200, 200], onChange: function(data) {
                $scope.positions = data;
            }}); 
        };
        reader.readAsDataURL(file);
    }
}