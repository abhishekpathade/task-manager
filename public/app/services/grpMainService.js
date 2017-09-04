angular.module('grpMainService',[])

    .factory('GroupsDB', function($http){

        var grpMainFactory = {};

        grpMainFactory.create= function(groupData){
            return $http.post('/api/grpCreate', groupData);
        }

        grpMainFactory.all = function() {
            return $http.get('/api/groupsall');
        }


        return grpMainFactory;
    })

    .factory('socketio', function($rootScope){

        var socket = io.connect();
        return {

            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },

            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.apply(function() {
                        if(callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    });