angular.module('grpEventService',[])

    .factory('GroupEventDB', function($http){

        var grpEventFactory = {};

        grpEventFactory.create= function(groupEveData){
            return $http.put('/api/grpEventCreate', groupEveData);
        }

        grpEventFactory.all = function() {
            return $http.get('/api/groupEvents');
        }
        // grpEventFactory.priority= function(groupEveData){
        //     return $http.put('/api/addPriority', {});
        // }

        return grpEventFactory;
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
    })