angular.module('Service', [])

    // super simple service
	// each function returns a promise object 
	.factory('Photos', ['$http',function($http) {
		return {
			get : function(from, to) {
				return $http.get('/api/photos/'+from+'/'+to);
			}
		}
	}]);