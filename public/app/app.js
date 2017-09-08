angular.module('MyApp', ['mainCtrl', 'authService', 'appRoutes', 'userCtrl', 'userService', 'storyService', 'storyCtrl','grpMainCtrl','grpMainService','grpEventCtrl','grpEventService', 'reverseDirective'])


.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');

})

// .config(['$qProvider', function ($qProvider) {
//             $qProvider.errorOnUnhandledRejections(false);
// }])