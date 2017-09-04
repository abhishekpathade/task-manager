angular.module('grpMainCtrl', ['grpMainService'])

    .controller('GroupController', function(GroupsDB, socketio) {

        var vm = this;

        GroupsDB.all()
            .success(function(data) {
                vm.grpMain = data;
            });

        vm.createGroup = function() {

            vm.processing = true;

            vm.message = '';
            GroupsDB.create(vm.groupData)
                .success(function(data) {
                    vm.processing = false;
                    //clear up the form
                    vm.groupData = {};

                    vm.message = data.message;

                });
        };
        // GroupEventDB.addPriority;

        socketio.on('groupsDB', function(data) {
            vm.grpMain.push(data);
        })

    });