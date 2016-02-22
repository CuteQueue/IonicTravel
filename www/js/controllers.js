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
        $scope.last_name = '';
        $scope.email='';
        $scope.password='';
        $scope.newUser={};

    $scope.signup = function() {

      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
 
      var credentials = {
          name: $scope.newUser.name,
          last_name: $scope.newUser.last_name,
          email: $scope.newUser.email,
          password: $scope.newUser.password
      }

      console.log('1');
      $auth.signup(credentials).then(function(response) {
          console.log('2');
          $auth.setToken(response);
          console.log('3');
          $location.path('/');
          console.log('You have successfully created a new account!');
        })
        .catch(function(response) {
          console.log('ERROR during registration');
        });
    };
  })


.controller('UsersCtrl', function($scope, $http, $auth) {
  $scope.current_ = null;
  var user = localStorage.getItem("user");
  var parseUser = JSON.parse(user);
  var user_id = parseUser.id;

  $http.get('http://localhost:8000/api/v1/user/' + user_id ).then(function(result) {
      $scope.current_user = result.data.data;
        console.log($scope.current_user);
        console.log($scope.current_user.name);
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



.controller('AccountCtrl', function($scope, $http, $auth, $rootScope, $state, $ionicHistory) {

     //----SHOW PROFIL----
     //Wenn noch kein Profil vorhanden, wird $scope.create() aufgerufen

    $scope.profils = [];
    $scope.name = null;

    /*Parameter übergeben (funktioniert)
      $http({
      url: 'http://localhost:8000/api/v1/profil/{33}', 
      method: "GET",
      params: {id: 33}
   }).then(function(result){ */

    //Current User (funktioniert nicht)
    /*var user_id = null;
    user_id: $rootScope.currentUser.id;
    console.log(user_id);*/

    var user = localStorage.getItem("user");
    var parseUser = JSON.parse(user);
    var user_id = parseUser.id;
    $scope.user_name = parseUser.name;
    $scope.user_last_name = parseUser.last_name;
     console.log("user_id:");
    console.log(user_id);

    $http.get('http://localhost:8000/api/v1/profil/' + user_id).then(function(result) {
      
        $scope.profil = result.data.data;
        console.log($scope.profil);
        console.log($scope.profil.id);

      /* if($scope.profil.id == null){
        console.log("leer");
        $state.go('tab.create');
       }else{
        console.log("nicht leer");
       }*/

      // console.log($scope.profils.data[0]); //für mehrere Profile
      //$scope.profils = $scope.profils.data[0] //für mehrere Profile
     
    });

    $scope.newProfil={};
        $scope.age = '';
        $scope.sex = '';
        $scope.location='';
        $scope.destination='';
        $scope.looking_for = '';
        $scope.interests = '';
      //  $scope.hobbies='';
        $scope.about = '';

    //----CREATE PROFILE----     
   $scope.create = function() {
        

        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
 
      var credentials = {
          age: $scope.newProfil.age,
          sex: $scope.newProfil.sex,
          location: $scope.newProfil.location,
          destination: $scope.newProfil.destination,
          looking_for: $scope.newProfil.looking_for,
          interests: $scope.newProfil.interests,
        //  hobbies: $scope.newProfil.hobbies,
          about: $scope.newProfil.about
      }
      console.log("Eingabe: ");
      console.log(credentials);

    var user = localStorage.getItem("user");
    var parseUser = JSON.parse(user);
    var parseUser_id = parseUser.id;
    console.log("User_id: ");
    console.log(parseUser_id);

 $http.post('http://localhost:8000/api/v1/profil/create', {
    user_id: parseUser_id,
    age: $scope.newProfil.age,
    sex: $scope.newProfil.sex,
    location: $scope.newProfil.location,
    destination: $scope.newProfil.destination,
    looking_for: $scope.newProfil.looking_for,
    interests: $scope.newProfil.interests,
   // hobbies: $scope.newProfil.hobbies,
    about: $scope.newProfil.about
    

 }).success(function(response) {
            console.log("Profil Created Successfully");
            $state.go('tab.account');
        }).error(function(){
          console.log("ERROR Profil cannot be created");
        });

   };

   //----UPDATE PROFILE----
   $scope.update = function() {

    $http.get('http://localhost:8000/api/v1/profil/' + user_id).then(function(result) {
      
        $scope.profil = result.data.data;
        console.log($scope.profil);
        console.log($scope.profil.id);
    });

     
     $ionicHistory.clearCache();
     $ionicHistory.clearHistory();
      
     //Eingabe vom Fomular (tab-account-create.html)
     var credentials = {
          age: $scope.profil.age,
          sex: $scope.profil.sex,
          location: $scope.profil.location,
          destination: $scope.profil.destination,
          looking_for: $scope.profil.looking_for,
          interests: $scope.profil.interests,
         // hobbies: $scope.profil.hobbies,
          about: $scope.profil.about
      }
      console.log("Eingabe: ");
      console.log(credentials);

    //Aktuelle User ID:
    var user = localStorage.getItem("user");
    var parseUser = JSON.parse(user);
    var parseUser_id = parseUser.id;
    console.log("User_id: ");
    console.log(parseUser_id);

    //Weiterleiten der Daten an Laravel 
    $http.put('http://localhost:8000/api/v1/profil/edit/' + user_id, {
      age: $scope.profil.age,
          sex: $scope.profil.sex,
          location: $scope.profil.location,
          destination: $scope.profil.destination,
          looking_for: $scope.profil.looking_for,
          interests: $scope.profil.interests,
          //hobbies: $scope.profil.hobbies,
          about: $scope.profil.about,
          user_id: parseUser_id
    }).success(function(response) {
            console.log("Profil Updated Successfully");
            $state.go('tab.account');
        }).error(function(){
          console.log("ERROR Profil cannot be updated");
        });

    };

});
