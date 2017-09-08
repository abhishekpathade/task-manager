angular.module('mainCtrl', [])

.controller('MainController', function($rootScope, $location, Auth, $window){

	var vm = this;
    var windowThatWasOpened;


	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function(){
		vm.loggedIn = Auth.isLoggedIn();


		Auth.getUser()
			.then(function(data){
				vm.user = data.data;

			});
	});

	vm.doLogin = function(){

		vm.processing = true;

        var tz = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
		vm.error = '';
		Auth.login(vm.loginData.username, vm.loginData.password, tz)
			.then(function(data){

				vm.processing = false

				Auth.getUser()
					.then(function(data){

						vm.user = data.data;
					});
				if (data.success) {
                    $location.path('/home');
                    Auth.checkOauthToken(vm.loginData.username)
					.then(function(data) {
						if (!data.data.hasToken) {
							Auth.getOauthURL()
								.then(function(data) {
									var url = data.data.url;
                                    windowThatWasOpened = $window.open(url, "Please sign in with Google", 'width=500px,height:700px');
							});

                            // window.addEventListener(function () {
                            //     windowThatWasOpened.close();
                                // window.close();
                                console.log("Done");
                                //    $location.path('/');
                            // });

						}
					});
                }
				else {
                    vm.error = data.message;
                }
			});
	}

	vm.doLogout = function(){
		Auth.logout();
        $location.path('/login');
	}
})