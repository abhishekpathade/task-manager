angular.module('grpEventCtrl', ['grpEventService'])

    .controller('GroupEventController', function(GroupEventDB, socketio) {

        var vm = this;

        GroupEventDB.all()
            .success(function(data) {
                vm.grpEvents = data;
            });

        vm.createGroupEvent = function() {

            vm.processing = true;

            vm.message = '';
            GroupEventDB.create(vm.groupEveData)
                .success(function(data) {
                    vm.processing = false;
                    //clear up the form
                    vm.groupEveData = {};

                    vm.message = data.message;

                });
            // GroupEventDB.priority();
        };

        socketio.on('groupEventDB', function(data) {
            vm.grpEvents.push(data);
        })

    })
