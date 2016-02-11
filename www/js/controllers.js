angular.module('starter.controllers', [])

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
 
        $scope.login = function() {
 
            var credentials = {
                email: $scope.loginData.email,
                password: $scope.loginData.password
            }
 
            console.log(credentials);
 
            $auth.login(credentials).then(function() {
                // Return an $http request for the authenticated user
                $http.get('http://localhost:8000/api/v1/user/login/user').success(function(response){
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
 
                    $state.go('app.users');
                })
                .error(function(){
                    $scope.loginError = true;
                    $scope.loginErrorText = error.data.error;
                    console.log($scope.loginErrorText);
                })
            });
        }
 
})
 
.controller('UsersCtrl', function($scope){
    $scope.users = [
      { user: 'First User', id: 1 },
      { user: 'Second User', id: 2 },
      { user: 'Third User', id: 3 }
    ];
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
