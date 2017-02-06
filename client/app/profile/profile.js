angular.module('boardly.profile', [])

.controller('ProfileController', function ($scope, $location, $window, Boards, Auth) {
  $scope.data = {};
  $scope.boardsTitle = [];

	Boards.getUserBoards($window.localStorage.getItem('user.boardly')).then(function(data) {
		$scope.data.boards = data;
	});

  	$scope.addBoard = function() {
	  	Boards.addBoard($scope.board.title, $window.localStorage.getItem('user.boardly'))
	  	.then(function(data){
	  		console.log(data);
	  		$scope.msg = "=> board added";
	  		$location.path('/profile');
	  	});	
  	}

  	$scope.addLink = function() {
	  	Boards.addLink($scope.link.url, $scope.board.title)
	  	.then(function(data){
	  		console.log(data);
	  		$scope.msg = "=> link added to board : " + $scope.board.title;
	  		$location.path('/profile');
	  	});	
  	}

  	$scope.getBoardsTitle = function(){
  		console.log($window.localStorage.getItem('user.boardly'))
  		Boards.getUserBoards($window.localStorage.getItem('user.boardly')).then(function(data) {
  			for (var i = 0; i < data.length; i++) {
  				$scope.boardsTitle.push(data[i].title)
  			}
  		});
  	}

})

.controller('PublicProfileController', function ($scope, $routeParams, Boards) {
  $scope.data = {};

	Boards.getUserBoards($routeParams.user).then(function(data) {
		$scope.data.boards = data;
	});

});