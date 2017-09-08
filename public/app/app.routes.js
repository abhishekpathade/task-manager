angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

        .when('/login', {
            templateUrl: 'app/views/pages/login.html'
        })
		.when('/home', {
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
        .when('/signup', {
            templateUrl: 'app/views/pages/signup.html'
        })

        .when('/addGroupEvents', {
            templateUrl: 'app/views/pages/groupEvents.html'
        })

        .when('/manageGroups', {
            templateUrl: 'app/views/pages/groups.html'
        })

		.when('/allStories', {
			templateUrl: 'app/views/pages/allStories.html',
			controller: 'AllStoriesController',
			controllerAs: 'story',
			resolve: {
				stories: function(Story) {
					return Story.allStories();
				}
			}

		})
		
	$locationProvider.html5Mode(true);

})
