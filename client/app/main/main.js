angular.module('boardly.main', [])

.controller('MainController', function ($scope, $location, $window, Boards, Auth) {
  $scope.data = {};

  	Boards.getAllBoards().then(function(data){
  		$scope.data.boards = data;
  	});

});