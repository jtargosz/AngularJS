'use strict';

/*
Pierwsza aplikacja napisana w angularze.
2017-08-01
*/

var app = angular.module('app', ['angular-storage', 'ngRoute']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

    // ================== ngRoute ====================

    $routeProvider.when('/results', {
        controller: 'showResults',
        templateUrl: 'partials/results.html'
    });

    $routeProvider.when('/flags', {
        controller: 'showQuestion',
        templateUrl: 'partials/index.html'
    });
    $routeProvider.otherwise({
        redirectTo: '/flags'
    });


}]);

app.controller('showQuestion', ['$scope', '$http', 'store', '$location', function($scope, $http, store, $location) {

    var maxSteps = 10;
    if (getStepfromStorage() > maxSteps) { $location.path("/results"); }

    var getData = function() {
        $http.get('model/countries.json').
        success(function(data) {
            var random = Math.floor((Math.random() * (data.length)));
            var arrayExclude = [random];
            var element = data[random];

            if (store.get('visited'))
                var visited = store.get('visited');
            else
                var visited = [];


            var addNew = true;

            angular.forEach(visited, function(value, key) {

                if (value.name == element.name) {
                    addNew = false;
                    getData();

                }

            });

            if (addNew) {
                visited.push(element);
                store.set('visited', visited);

            }


            function getRandNumber() {
                var randQuestion = randomNumbersExcluded(data.length, arrayExclude);
                arrayExclude.push(randQuestion);
                return randQuestion;
            }


            var addFalseQuestion = [];
            addFalseQuestion.push(element);

            addFalseQuestion.push(data[getRandNumber()]);
            addFalseQuestion.push(data[getRandNumber()]);
            addFalseQuestion.push(data[getRandNumber()]);


            $scope.question = addFalseQuestion;
            $scope.visited = store.get('visited');
            $scope.countries = element;
            $scope.maxSteps = maxSteps;

        }).error(function() {
            console.log('Błąd pobrania pliku json');
        });


    };
    getData();




    $scope.random = function() {
        return 0.5 - Math.random();
    };

    function getStepfromStorage() {
        if (store.get('step'))
            var step = store.get('step');
        else
            var step = 1;

        return step;
    }


    $scope.getStep = function() {
        return getStepfromStorage();
    };


    $scope.addStep = function() {
        var step = getStepfromStorage();
        step = ++step;

        store.set('step', step);
    };



    $scope.checkAnswer = function() {

        if (angular.isUndefined($scope.question.name)) { alert("Nie zaznaczono odpowiedzi."); } else {

            // powtarzam się!
            if (getStepfromStorage() > 9) { $location.path("/results"); }

            var flag_128 = true;

            // zbędna funkcja: 
            angular.forEach($scope.question, function(value, key) {
                if (value.name == $scope.question.name) { flag_128 = value.flag_128; }
            });


            if (store.get('allAnswers'))
                var allAnswers = store.get('allAnswers');
            else
                var allAnswers = [];

            // zbędne zmienne:
            var selectedAnswerStep = getStepfromStorage();
            var selectedAnswer = $scope.question.name;
            var selectedAnswerFlags = flag_128;
            var goodAnswer = $scope.countries.name;
            var goodFlags = $scope.countries.flag_128;

            if ($scope.question.name === $scope.countries.name) {
                //alert("Odpowiedź poprawna :-). To była flaga " + $scope.question.name);
                var wrong = 0;
            } else {
                //alert("Niestety, ale to była flaga " + $scope.countries.name + " a nie " + $scope.question.name);
                var wrong = 1;
            }

            var activeAnswer = { selectedAnswerStep: selectedAnswerStep, selectedAnswer: selectedAnswer, selectedAnswerFlags: selectedAnswerFlags, goodAnswer: goodAnswer, goodFlags: goodFlags, wrong: wrong };
            allAnswers.push(activeAnswer);
            store.set('allAnswers', allAnswers);

            $scope.addStep();
            getData();
        }
    };

    function randomNumbersExcluded(max, excluded) {
        var min = 1;

        var random = Math.floor(Math.random() * (max - min) + min);
        var repeat = false;

        angular.forEach(excluded, function(value, key) {
            if (random == value) { repeat = true; }
        });

        if (repeat)
            return randomNumbersExcluded(min, max, excluded);
        else
            return random;
    }

    $scope.getData = function() {
        getData();
    };

    $scope.startNew = function() {
        store.remove('visited');
        store.remove('allAnswers');
        store.remove('step');
    };

}]);

app.controller('showResults', ['$scope', '$http', 'store', '$location', function($scope, $http, store, $location) {

    var allAnswers = store.get('allAnswers');
    var visited = store.get('visited');
    var step = store.get('step');


    if (!step)
        $location.path("/flags");

    $scope.AnswerInt = function(int) {
        return (int === 1) ? 'źle' : 'dobrze';
    };

    $scope.AnswerHint = function(int) {
        return (int === 1) ? 'danger' : 'success';
    }

    // powtarzam się!
    $scope.startNew = function() {
        store.remove('visited');
        store.remove('allAnswers');
        store.remove('step');
        $location.path("/flags");
    };

    $scope.visited = visited;
    $scope.allAnswers = allAnswers;
    $scope.step = step;

}]);

app.controller('navigation', ['$scope', '$location', 'store', function($scope, $location, store) {

    $scope.isActive = function(path) {
        return $location.path() === path;
    };


}]);