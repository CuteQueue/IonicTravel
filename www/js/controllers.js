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
            console.log("Login credentials:");
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
 
                    $state.go('tab.dash');
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

     
          $auth.signup(credentials).then(function(response) {
          $auth.setToken(response);
          $location.path('/');
          console.log('You have successfully created a new account!');
        })
        .catch(function(response) {
          console.log('ERROR during registration');
        });
    };
  })

.controller('ContactCtrl', function($scope, $http, $auth, $state, $cordovaEmailComposer) {

  $scope.sendEmail = function(){
      $cordovaEmailComposer.isAvailable().then(function() {
       // is available
       console.log('available');
     }, function () {
       // not available
       console.log('NOT available');
     });

      var email = {
        to: 'manuela.reker@gmx.de',
        cc: 'erika@mustermann.de',
        bcc: ['john@mustermann.com', 'jane@mustermann.com'],
        attachments: [
          'file://img/logo.png',
          'res://icon.png',
          'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
          'file://README.pdf'
        ],
        subject: 'Cordova Icons',
        body: 'How are you? Nice greetings from Leipzig',
        isHtml: true
      };

     $cordovaEmailComposer.open(email).then(null, function () {
       // user cancelled email
       console.log('User cancelled Email');
     });
   
  };
})


.controller('findMateCtrl', function($scope, $http, $auth) {
  /*$scope.current_ = null;
  var user = localStorage.getItem("user");
  var parseUser = JSON.parse(user);
  var user_id = parseUser.id;

  $http.get('http://localhost:8000/api/v1/user/' + user_id ).then(function(result) {
      $scope.current_user = result.data.data;
        console.log($scope.current_user);
        console.log($scope.current_user.name);
  });*/


   $scope.destination='';
  $scope.search = {};
  $scope.Ausgabe = {};
  $scope.users = '';
  $scope.profiles=[];
  $scope.profileAusgabe = {};
  var startdate='';
  var zaehler = 0;
  var test = '';

  $scope.suche = function (){

    $scope.Ausgabe = {}; 
    var destination = $scope.search.destination;

    //Array der gesamten User
    $http.get('http://localhost:8000/api/v1/user').then(function(result) {
        $scope.users = result.data.data;

        //User-Array durchgehen
        for(var suchID = 0; suchID < $scope.users.length; ++suchID){
         // console.log($scope.users[suchID].id);
          var user_id = $scope.users[suchID].id;
          console.log('ID1: ' + user_id);
          $http.get('http://localhost:8000/api/v1/profil/' + user_id).then(function(result) {
            $scope.profiles = result.data.data;
            
            if($scope.profiles.destination == destination){
              console.log($scope.profiles.startdate);
              test = $scope.profiles.user_id;
              $scope.profileAusgabe[test] = $scope.profiles;
              console.log("Zaheler:");
              console.log(test);
              test++;
             console.log($scope.profileAusgabe);
              console.log($scope.profiles.id);
                //User mit passendem Reiseziel in Array speichern
                $http.get('http://localhost:8000/api/v1/user/' + $scope.profiles.user_id).then(function(result) {
                  $scope.users = result.data.data;
                  $scope.Ausgabe[zaehler] = $scope.users;
                  zaehler++;
                });
              };
          }); 
        };
    });
  };

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

  $scope.TabMate = function(){
    $state.go('tab.findMate');
  };

  $scope.TabProfile = function(){
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
      historyRoot: true
    });
    $state.go('tab.profile');

  };


})



.controller('ProfileCtrl', function($scope, $http, $auth, $rootScope, $state, $ionicHistory, $stateParams) {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
    });
     $scope.loadProfile = function() {  
     //----SHOW PROFIL----
     /*Wird beim Aufruf von Profile aufgerufen.
     - Wenn keine ID übergeben wird, wird das eigene Profil aufgerufen
     - Wenn noch kein Profil vorhanden, wird $scope.create() aufgerufen 
     - Wenn eine ID übergeben wird, wird das entsprechende Profil zur user id aufgerufen */

    $scope.profils = [];
    $scope.profil = [];
    $scope.user = [];
    $scope.name = null;

    
    var user_id = $stateParams.id;
    console.log("stateParams:");
    

    console.log($stateParams.id);
     $scope.user_name = '';
     $scope.user_last_name= '';


     //Wenn kein Parameter übergeben, wird das eigene Profil angezeigt
     if ($stateParams.id == null){
        $state.go('tab.profile');

       // console.log("acc");
        var user = localStorage.getItem("user");
        var parseUser = JSON.parse(user);
        var user_id = parseUser.id;
        $scope.user_name = parseUser.name;
        $scope.user_last_name = parseUser.last_name;
        console.log("user_id:");
        console.log(user_id);

        $http.get('http://localhost:8000/api/v1/profil/' + user_id).then(function(result) {
            if(result.data.data.id == null){

                console.log("Kein Profil vorhanden");
                $state.go('tab.create');

            }else{

                console.log("Profil vorhanden");
                $scope.profil = result.data.data;
                console.log($scope.profil);
                console.log($scope.profil.id);
            };
        });

      }
      else{
      //Wenn ID übergeben wurde, wird das Profil zur übergebenden User ID geladen
   

       $http.get('http://localhost:8000/api/v1/user/' + user_id).then(function(result) {
          $scope.user = result.data.data;
          $scope.user_name = $scope.user.name;
          $scope.user_last_name = $scope.user.last_name;
          console.log($scope.user);
          console.log($scope.user.name);
       

            $http.get('http://localhost:8000/api/v1/profil/' + $scope.user.id).then(function(result) {
                console.log($scope.user.id);
                $scope.profil = result.data.data;
                console.log($scope.profil);
                console.log($scope.profil.id);  
     
            });

        });

  };
    console.log("User Name:");
    console.log($scope.user.name);

    $scope.newProfil={};
        $scope.age = '';
        $scope.sex = '';
        $scope.location='';
        $scope.destination='';
        $scope.startdate='';
        $scope.looking_for = '';
        $scope.interests = '';
        $scope.about = '';
        $scope.looking_for_MeetUp = '';
        $scope.looking_for_Roadtrip = '';
        $scope.looking_for_TravelMate = '';

      //Liste für Looking_For:
     $scope.looking_forList = [
    { text: "MeetUp", checked: false },
    { text: "Roadtrip", checked: false },
    { text: "TravelMate", checked: false }
  ];

};
$scope.loadProfile();
    //----CREATE PROFILE----     
   $scope.create = function() {  

        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true,
              historyRoot: true
            });
 
      var credentials = {
          age: $scope.newProfil.age,
          sex: $scope.newProfil.sex,
          location: $scope.newProfil.location,
          destination: $scope.newProfil.destination,
          looking_for: $scope.newProfil.looking_for,
          looking_for_MeetUp: $scope.newProfil.looking_for,
          looking_for_Roadtrip: $scope.newProfil.looking_for,
          looking_for_TravelMate: $scope.newProfil.looking_for,
          interests: $scope.newProfil.interests,
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
    startdate: $scope.newProfil.destination,
    looking_for: $scope.newProfil.looking_for,
    interests: $scope.newProfil.interests,
    about: $scope.newProfil.about
    

 }).success(function(response) {
            console.log("Profil Created Successfully");
            $state.go('tab.profile');
        }).error(function(){
          console.log("ERROR Profil cannot be created");
        });

   };

   //----UPDATE PROFILE----
   $scope.update = function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
      historyRoot: true
    });
    var user = localStorage.getItem("user");
    var parseUser = JSON.parse(user);
    var user_id = parseUser.id;

    $http.get('http://localhost:8000/api/v1/profil/' + user_id).then(function(result) {
      
        $scope.profil = result.data.data;
        console.log("Update. Profil:")
        console.log($scope.profil);
        console.log("Update. Profil.id:")
        console.log($scope.profil.id);
    });
     
     $ionicHistory.clearCache();
     $ionicHistory.clearHistory();
      
     //Eingabe vom Fomular (tab-profile-create.html)
     var credentials = {
          age: $scope.profil.age,
          sex: $scope.profil.sex,
          location: $scope.profil.location,
          destination: $scope.profil.destination,
          startdate: $scope.profil.startdate,
          looking_for: $scope.profil.looking_for,
          interests: $scope.profil.interests,
          looking_for: $scope.profil.looking_for,
          about: $scope.profil.about
      }
      console.log("Eingabe: ");
      console.log(credentials);
      console.log("looking_forList: ");
      console.log($scope.looking_forList);

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
          startdate: $scope.profil.startdate,
          looking_for: $scope.profil.looking_for,
          interests: $scope.profil.interests,
          about: $scope.profil.about,
          user_id: parseUser_id
    }).success(function(response) {
            console.log("Profil Updated Successfully");
            //$ionicHistory.clearCache();
            //$ionicHistory.clearHistory();
            //$state.go('tab.profile');
            
            $scope.goProfil();
        }).error(function(){
          console.log("ERROR Profil cannot be updated");
        });

    };

    //Weiterleiten zum ContactCtrl 
    $scope.contact = function(){
      console.log("working");
      $state.go('tab.mate-contact');
    };

    $scope.goEdit = function(){
      console.log("workingEdit BUTZ");
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
      });
      $scope.loadProfile();
      $state.go('tab.update');
    };

    $scope.goProfil = function(){
      console.log("workingProfil");
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
      });
      $scope.loadProfile();
      $state.go('tab.profil');
    };
    

});
