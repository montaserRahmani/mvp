angular.module('boardly.services', [])

.factory('Boards', function ($http) {

  var getAllBoards = function (board) {
    return $http({
      method: 'GET',
      url: '/api/boards',
    })
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    }).catch(function(err){
      if(err) {
        console.log(err);
        throw err;
      }
    });
  };    

  var getUserBoards = function (user) {
    return $http({
      method: 'GET',
      url: '/api/users/' + user
    })
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    }).catch(function(err){
      if(err) {
        console.log(err);
        throw err;
      }
    });
  };            

  var addLink = function (url, board) {
    return $http({
      method: 'POST',
      url: '/api/links',
      data: JSON.stringify({url : url, board : board})
    })
    .then(function (resp) {
      console.log("link created");
      return resp;
    }).catch(function(err){
      if(err) {
        console.log(err);
        throw err;
      }
    });
  };

  var addBoard = function (board, user) {
    return $http({
      method: 'POST',
      url: '/api/boards',
      data: JSON.stringify({board : board, username : user})
    })
    .then(function (resp) {
      console.log("Board created");
      return resp;
    }).catch(function(err){
      if(err) {
        console.log(err);
        throw err;
      }
    });
  };

  var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

  var isValidUrl = function (url) {
    return url.match(rValidUrl);
  }

  return {
    getAllBoards : getAllBoards,
    addLink : addLink,
    addBoard : addBoard,
    getUserBoards : getUserBoards,
    isValidUrl : isValidUrl
  }

})
.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };          

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.boardly');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.boardly');
    $window.localStorage.removeItem('user.boardly');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
