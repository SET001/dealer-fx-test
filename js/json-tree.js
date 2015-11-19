angular.module('json-tree', [])
.directive('json', [function(){
	return {
		restrict: 'A',
		templateUrl: 'json-tree.html',
		scope: {
			json: '=',
			search: '='
		},
		controller: function($scope, $sce){
			$scope.isExpandable = function(data){
				return data && typeof data === 'object';
			}
			$scope.getType = function(data){
				if (data instanceof Array){
					return 'Array' + ' [' + data.length + ']';
				}
				return 'Object';
			}
			$scope.getValue = function(value){
				var regexp = new RegExp($scope.search, 'gim');
				if (typeof value == 'string'){
					if (match = value.match(regexp)){
						_.forEach(_.uniq(match), function(m){
							value = value.replace(m, '<span class="selected">'+m+'</span>');
						})
					}
				}
				return $sce.trustAsHtml(value+'');
			}
			$scope.getClass = function(data, expand){
				var classes = [];
				if ($scope.isExpandable(data)){
					classes.push('glyphicon');
					classes.push('expander');
					if (expand) classes.push('glyphicon-triangle-bottom');
					else classes.push('glyphicon-triangle-right');
				}else classes.push('empty-expander');
			return classes.join(' ');
			}
		}
	}
}]);
