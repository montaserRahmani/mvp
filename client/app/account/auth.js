// do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('boardly.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.signin = function () {
    var passFlag = checkPassword($scope.user.password);
    var userFlag = checkUserName($scope.user.username);
    if(userFlag && passFlag){
      Auth.signin($scope.user)
        .then(function (token) {
          console.log(token)
          $window.localStorage.setItem('com.boardly', token);
          $window.localStorage.setItem('user.boardly', $scope.user.username);
          $location.path('/profile');
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      if(!userFlag && !passFlag){
        $scope.msg = "Wrong input for user and Password \n * username should have only numbers and letters \n * Password should be at least 6 characters long and have atleast 1 symbol and 1 number"
      } else if(!userFlag){
        $scope.msg = "* Username should have only numbers and letters"
      } else if (!passFlag){
        $scope.msg = "* Password should be at least 6 characters long and have atleast 1 symbol and 1 number"
      }
    }
  };

  $scope.signup = function () {
    var passFlag = checkPassword($scope.user.password);
    var userFlag = checkUserName($scope.user.username);
    if(userFlag && passFlag){
      Auth.signup($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.boardly', token);
          $window.localStorage.setItem('user.boardly', $scope.user.username);
          $location.path('/profile');
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      if(!userFlag && !passFlag){
        $scope.msg = "Wrong input for user and Password \n * username should have only numbers and letters \n * Password should be at least 6 characters long and have atleast 1 symbol and 1 number"
      } else if(!userFlag){
        $scope.msg = "* Username should have only numbers and letters"
      } else if (!passFlag){
        $scope.msg = "* Password should be at least 6 characters long and have atleast 1 symbol and 1 number"
      }
    }
  };

  $scope.signout = function(){
    Auth.signout();
  }

  var checkPassword = function(password){
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return regularExpression.test(password);
  };

  var checkUserName = function(user){
    var regularExpression = /^[a-zA-Z0-9]+$/;
    return regularExpression.test(user);
  };

});
