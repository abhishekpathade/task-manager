angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken){
	
	var authFactory = {};

	authFactory.login = function(username, password, tz){
		return $http.post('/api/login', {
			username: username,
			password: password,
			tz: tz
		})

		.then(function(data){
			AuthToken.setToken(data.data.token);
			return data.data;
		})
	}

	authFactory.checkOauthToken = function(username) {
		return $http.post('/api/oauth2token', {
			username: username
		});
	};

	authFactory.getOauthURL = function() {
        return $http.get('/api/oauth2url');
	};

	authFactory.isLoggedIn = function() {
		if(AuthToken.getToken())
			return true;
		else
			return false;
	}

	authFactory.getUser = function() {
			if(AuthToken.getToken())
				return $http.get('/api/me');
			else
				return $q.reject({ message:"User has no token"});
	}

	authFactory.logout = function() {
        console.log("click0");

        AuthToken.setToken();
	}

	return authFactory;

})

.factory('AuthToken', function($window){
	var authTokenFactory = {};

	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token){
		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	}

	return authTokenFactory;

})

.factory('AuthInterceptor', function($q, $location, AuthToken){
	var interceptorFactory = {};

	interceptorFactory.request = function(config){

		var token = AuthToken.getToken();

		if(token){

			config.headers['x-access-token'] = token;

		}
		return config;
	};

	interceptorFactory.responseError = function(response){
		if(response.status == 403){
			$location.path('/login');
		}
		return $q.reject(response);
	};

	return interceptorFactory;
})









