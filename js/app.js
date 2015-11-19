angular.module('dealer-fx-test', ['json-tree'])
.controller('MainCtrl', ['$scope', '$http', function($scope, $http){
	$http.get('test.json').success(function(json){
		$scope.json_object = json;
		$scope.regexp_to_search = '\\d+';
		console.log(json);
	});
}]);
