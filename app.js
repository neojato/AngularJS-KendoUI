var app = angular.module('address-book', ['kendo-directives']);

app.controller('ListCtrl', ['$scope','$http', function($scope, $http){
  $scope.autocompleteOptions = {
    dataTextField: 'name',
    change: function() {
      $scope.filter = $scope.search.value();
    }
  };
}]);