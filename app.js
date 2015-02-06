/* global angular, kendo, console */
(function () {
    'use strict';

    var app = angular.module('address-book', ['kendo.directives']);

    app.controller('ListCtrl', ['$scope', '$http', 'EventQueue', function ($scope, $http, Events) {
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
                contact.dob = kendo.toString(new Date(contact.dob), 'MM/dd/yyyy');
                contact.name = contact.first_name + ' ' + contact.last_name;

                return contact;
            });
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

        $scope.splitterOptions = {
            panes: [{
                size: "5%"
            }]
        };

        $scope.twitterOptions = {
            mask: '@&&&&&&&&&&&&&&&',
            promptChar: ' '
        };

        $scope.colourOptions = {
            select: function (e) {
                this.$angular_scope.contact.colour = e.value;
                this.$angular_scope.contact.background_colour = createBackgroundColour(e.value);
                $scope.$apply();
            }
        };

        $scope.setFilter = function (letter) {
            if (letter !== $scope.letterFilter) {
                $scope.letterFilter = letter;
            } else {
                $scope.letterFilter = null;
            }
        };

        $scope.$on('kendoRendered', function () {
            $scope.kendoReady = true;
            Events.execute($scope);
        });
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

    app.service('EventQueue', function () {
        var events = [],
            fired = false,
            ctx;

        function addEvent (event) {
            events.push(event);
            if (fired) {
                executeEvents(ctx);
            }
        }

        function executeEvents (context) {
            ctx = context;
            fired = true;
            for (var i = 0, len = events.length; i < len; i++) {
                var event = events[i];
                event.callback.bind(context)();
            }
        }

        return {
            add: addEvent,
            execute: executeEvents
        };
    });
})();
