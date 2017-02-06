angular.module('boardly', [
  'boardly.services',
  'boardly.profile',
  'boardly.auth',
  'boardly.main',
  'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/account/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/account/signup.html',
      controller: 'AuthController'
    })    
    .when('/profile', {
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileController',
      authenticate: true
    })
    .when('/signout', {
      templateUrl: 'app/account/signout.html',
      controller: 'AuthController'
    })
    .when('/addBoard', {
      templateUrl: 'app/profile/addBoard.html',
      controller: 'ProfileController',
      authenticate: true 
    })
    .when('/addLink', {
      templateUrl: 'app/profile/addLink.html',
      controller: 'ProfileController',
      authenticate: true 
    })
    .when('/users/:user', {
      templateUrl: 'app/profile/publicProfile.html',
      controller: 'PublicProfileController'
    })
    .when('/', {
      templateUrl: 'app/main/main.html',
      controller: 'MainController'
    })
    .otherwise({redirectTo:'/'});

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
  $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.boardly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
