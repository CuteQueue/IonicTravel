angular.module('starter.controllers', ['ui.router'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AuthCtrl', function($scope, $location, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope) {
 
        $scope.loginData = {}
        $scope.loginError = false;
        $scope.loginErrorText;

        $scope.name = '';
        $scope.email='';
        $scope.password='';
        $scope.newUser={};
  
 
        $scope.login = function() {

            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
 
            var credentials = {
                email: $scope.loginData.email,
                password: $scope.loginData.password
            }
            
            console.log(credentials);
 
            $auth.login(credentials).then(function() {
                // Return an $http request for the authenticated user
                $http.get('http://localhost:8000/api/v1/authenticate/user').success(function(response){
                    // Stringify the retured data
                    var user = JSON.stringify(response.user);
 
                    // Set the stringified user data into local storage
                    localStorage.setItem('user', user);
 
                    // Getting current user data from local storage
                    $rootScope.currentUser = response.user;
                    // $rootScope.currentUser = localStorage.setItem('user');;
                    
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    });
 
                    $state.go('tab.users');
                })
                .error(function(){
                    $scope.loginError = true;
                    $scope.loginErrorText = error.data.error;
                    console.log($scope.loginErrorText);
                })
            });

            /*$http.post('http://localhost:8000/api/v1/authenticate',$scope.loginData)
                .success(function(data){
                    $scope.email=$scope.loginData.email;
                    $scope.password=$scope.loginData.password;
                });*/

        };

        /*$scope.register = function () {
 
            $http.post('http://localhost:8000/api/v1/user',$scope.newUser)
                .success(function(data){
                    $scope.name=$scope.newUser.name;
                    $scope.email=$scope.newUser.email;
                    $scope.password=$scope.newUser.password;
                    //$scope.login();
            })
 
        };*/
 
})

 .controller('SignupCtrl', function($scope, $location, $auth, $ionicHistory) {
    $scope.name = '';
    $scope.email='';
    $scope.password='';
    $scope.newUser={};
      console.log('!!!');

    $scope.signup = function() {

      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
 
      var credentials = {
          name: $scope.newUser.name,
          email: $scope.newUser.email,
          password: $scope.newUser.password
      }

      console.log('1');
      $auth.signup(credentials).then(function(response) {
          console.log('2');
          $auth.setToken(response);
          console.log('3');
          $location.path('/');
          console.log('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          console.log('ERROR during registration');
        });
    };
  })


.controller('UsersCtrl', function($scope, $http, $auth) {
  $scope.users = null;

  $http.get('http://localhost:8000/api/v1/allUser').then(function(result) {
      $scope.users = result.data;
  });

})




.controller('TabCtrl', function($scope, $auth, $ionicHistory, $state){
  $scope.logout = function() {
      localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
 
      $state.go('auth');
  };

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };
})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
