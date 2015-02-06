/* global angular, kendo, console */
(function () {
    'use strict';

    var app = angular.module('address-book', ['kendo.directives']);

    app.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.letters = [];

        var createBackgroundColour = function (colour) {
            var c = kendo.parseColor(colour);
            return 'rgba({r}, {g}, {b}, 0.1)'
                .replace('{r}', c.r)
                .replace('{g}', c.g)
                .replace('{b}', c.b);
        };

        $http.get('contacts.json').success(function (response) {
            $scope.contacts = angular.forEach(response, function (contact) {
                // add unique letters to alphabet array
                if ($scope.letters.indexOf(contact.first_name[0]) === -1) {
                    $scope.letters.push(contact.first_name[0]);
                }
                contact.dob = kendo.toString(new Date(contact.dob), 'MM/dd/yyyy');
                contact.name = contact.first_name + ' ' + contact.last_name;

                return contact;
            });

            $scope.letters.sort();
        });

        $scope.tagOptions = {
            dataSource: ['Friend', 'Colleague', 'Acquaintance', 'Best friend', 'Enemy', 'Random', 'School friend', 'Family', 'Me']
        };

        $scope.autocompleteOptions = {
            dataTextField: 'name',
            change: function () {
                $scope.filter = $scope.search.value();
            }
        };

        $scope.twitterOptions = {
            mask: '@&&&&&&&&&&&&&&&',
            promptChar: ' '
        };

        $scope.colourOptions = {
            select: function (e) {
                this.$angular_scope.contact.colour = e.value;
                $scope.$apply();
            }
        };
    }]);

    app.filter('nameFilter', function () {
        return function (contacts, letter) {
            if (contacts && letter) {
                return contacts.filter(function (item) {
                    return item.first_name[0] === letter;
                });
            } else {
                return contacts;
            }
        };
    });
})();
