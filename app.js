/* global angular, kendo, console */
(function () {
    'use strict';

    var app = angular.module('address-book', ['kendo.directives']);

    app.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.letters = [];

        $http.get('contacts.json').success(function (response) {
            $scope.contacts = angular.forEach(response, function (contact) {
                // add unique letters to alphabet array
                if ($scope.letters.indexOf(contact.first_name[0]) === -1) {
                    $scope.letters.push(contact.first_name[0]);
                }
                contact.dob = kendo.toString(new Date(contact.dob), 'dd/MM/yyyy');
                contact.name = contact.first_name + ' ' + contact.last_name;

                return contact;
            });

            $scope.letters.sort();
        });

        $scope.autocompleteOptions = {
            dataTextField: 'name',
            change: function () {
                $scope.filter = $scope.search.value();
            }
        };
    }]);
})();
