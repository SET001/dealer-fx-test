angular.module('tree', [])
.service('Tree', [function(){
	return {

		search: function(string, regexpString){
			var regexp;
			if (!string) return false;
			try {
				regexp = new RegExp(regexpString, 'g');
			} catch(e){
				return false;
			}
			return string.match(regexp);
		},

		getValue: function(data, regexpString, onMatches){
			var value;
			if (data && typeof data === 'object'){
				if (data instanceof Array){
					value = 'Array' + ' [' + data.length + ']';
				} else {
					value = 'Object';
				}
			}else{
				value = String(data);
				if (value && regexpString){
					var matches = this.search(value, regexpString);
					if (matches){
						value = this.highlight(value, matches);
						if (onMatches) onMatches();
					}
				}
			}
			return value;
		},

		highlight: function(string, highlights){
			var value = string;
			if(highlights){
				var _highlights = highlights.filter(function(item, pos, self) {
			    return self.indexOf(item) == pos;
				});
				for(var i in _highlights){
					var re = new RegExp(_highlights[i], 'g');
					if (re) value = value.replace(re, '<span class="selected">'+_highlights[i]+'</span>');
				}
			}
			return value;
		},
	}
}])

.directive('tree', [function(){
	return {
		restrict: 'A',
		templateUrl: 'js/tree/tree.html',
		scope: {
			data: '=tree',
			search: '='
		},
	}
}])

.directive('treeBranch', [
'$compile','$sce', '$templateCache', '$templateRequest', 'Tree',
function($compile, $sce, $templateCache, $templateRequest, Tree){
	return{
		restrict: 'E',
		require: '?^^treeBranch',
		scope: {
			data: '=',
			name: '=',
			search: '='
		},

		controller: function($scope, $timeout){
			$scope.toggle = function(){
				$scope.expand = !$scope.expand;
			};

			$scope.getValue = function(){
				return $sce.trustAsHtml(Tree.getValue(
					$scope.data,
					$scope.search,
					function(){
						$scope.expand = true;
						if ($scope.prev) $scope.prev.expandAll();
					}));
			};

			$scope.$watch('search', function(){
				$scope.expand = false;
				$scope.value = $scope.getValue();
			});


			this.name = $scope.name;
			this.expandAll = function(){
				$scope.expand = true;
				if ($scope.prev) $scope.prev.expandAll();
			};
		},

		link: function($scope, element, attrs, prev){
			$scope.prev = prev;
			$templateRequest('js/tree/treeBranch.html').then(function(){
				element.append($templateCache.get('js/tree/treeBranch.html'));
				if (typeof $scope.data === 'object'){
					element.append('<div tree="data" search="search" ng-show="expand"></div>');
				}
				$compile(element.contents())($scope);

			});

		}
	}
}]);
