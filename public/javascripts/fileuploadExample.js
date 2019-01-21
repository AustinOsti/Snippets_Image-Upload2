var app = angular.module('fileUpload', ['ngFileUpload']);


app.controller('formCtrl', ['Upload', '$scope', function(Upload, $scope){	
	$scope.submit = function(){	
		$scope.uploaded = false;
		$scope.error = false;	
		$scope.errorMsg = "";			
		if ($scope.upload.file.type && $scope.upload.file.type == 'image/jpeg') {
			Upload.upload({
				url: '/uploads',
				method: 'post',
				data: $scope.upload
			})
			.then(function (response) {
				$scope.uploaded = true;	
				$scope.upload = response.data;
			});			
		} else {
			$scope.error = true;
			$scope.errorMsg = "Missing or wrong photo file type";
		}
	}
}]);
