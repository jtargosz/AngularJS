'use strict';

/*
Name: Simple TODO List localStorage
Author: Jaroslaw Targosz
Data: 25.01.2017
*/

var app = angular.module('app', ['angular-storage', 'gg.editableText']);

app.controller('todo', ['$scope', '$filter', 'store', function($scope, $filter, store) {

    if (store.get('todos'))
        $scope.todos = store.get('todos');
    else
        $scope.todos = [];

    function save() {
        store.set('todos', $scope.todos);
    }

    $scope.createTodo = function() {
        if ($scope.formData.text.length > 3) {
            $scope.todos.push({ text: $scope.formData.text, done: false });
            save();
            $scope.formData.text = '';
        } else {
            alert("Wpisz zadanie do wykonania (więcej niż 3 znaki)");
        }
    };

    $scope.check = function() {
        save();
    };

    $scope.customClass = function($done) {
        if ($done)
            return 'danger';
        else
            return 'success';

    };


    $scope.validate = function(value) {
        var index = this.$index;

        if (value.length < 4) {
            alert('Wpisz zadanie do wykonania (więcej niż 3 znaki)');
        } else {

            angular.forEach($scope.todos, function(val, key) {
                if (key == index) {
                    val.text = value;
                    save();
                }
            });

            return value;
        }

    }

    $scope.deleteTodo = function() {
        $scope.todos = _.filter($scope.todos, function(todo) {
            return !todo.done;
            //return _.contains([false], todo.done);
        });

        save();
    };

    $scope.deleteAll = function() {
        store.remove('todos');
        $scope.todos = [];
    };

}]);