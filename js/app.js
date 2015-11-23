angular.module('dealer-fx-test', ['tree'])
.controller('MainCtrl', ['$scope', '$http', function($scope, $http){
	$http.get('test.json').success(function(json){
		$scope.data = json;
		$scope.regexp_to_search = '\\d+';
	});
}]);
