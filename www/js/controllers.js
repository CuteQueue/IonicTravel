angular.module('starter.controllers', ['ui.router'])

.controller('DashCtrl', function($scope, AppImages) {
      $scope.images = AppImages.all();

})


.controller('AuthCtrl', function($scope, $location, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope, AppImages) {
        
      $scope.images = AppImages.all();
      $scope.loginData = {}
      $scope.loginError = false;
      $scope.loginErrorText;
       


      if ($auth.isAuthenticated()){
        //console.log("User ist schon eingelogt");
        $state.go('tab.dash');
      }
 
      $scope.login = function() {

        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
 
        var credentials = {
          email: $scope.loginData.email,
          password: $scope.loginData.password
        } 
        
       // console.log("Login credentials:");
       // console.log(credentials);
 
        $auth.login(credentials).then(function() {
        // Return an $http request for the authenticated user
          $http.get('http://192.168.178.46:8092/api/v1/authenticate/user').success(function(response){
              // Stringify the retured data
              var user = JSON.stringify(response.user);

              localStorage.setItem('user', user);
 
              // Getting current user data from local storage
              $rootScope.currentUser = response.user;
              
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

      };

      
})

.controller('SignupCtrl', function($scope, $location, $auth, $ionicHistory, AppImages) {

      $scope.images = AppImages.all();
      $scope.name = '';
      $scope.last_name = '';
      $scope.email='';
      $scope.mobilenumber ='';
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




.controller('findMateCtrl', function($scope, $http, $auth, AppImages) {

      $scope.images = AppImages.all();
      $scope.destination='';
      $scope.search = {};
      $scope.Ausgabe = {};
      $scope.users = '';
      $scope.profiles=[];
      $scope.profileAusgabe = {};
      var startdate='';
      var zaehler = 0;
      var zeahler2 = 0;

      $scope.suche = function (){

          $scope.Ausgabe = {}; 
          var destination = $scope.search.destination;

          //Array der gesamten User
          $http.get('http://192.168.178.46:8092/api/v1/user').then(function(result) {
              $scope.users = result.data.data;

              //User-Array durchgehen
              for(var suchID = 0; suchID < $scope.users.length; ++suchID){
                   // console.log($scope.users[suchID].id);
                    var user_id = $scope.users[suchID].id;
                    console.log('ID: ' + user_id);
                    $http.get('http://192.168.178.46:8092/api/v1/profil/' + user_id).then(function(result) {
                          $scope.profiles = result.data.data;
                          
                          if($scope.profiles.destination == destination){
                              //console.log($scope.profiles.startdate);
                              zeahler2 = $scope.profiles.user_id;
                              $scope.profileAusgabe[zeahler2] = $scope.profiles;
                              zeahler2++;
                              //console.log($scope.profileAusgabe);
                              //console.log($scope.profiles.id);
                              
                              //User mit passendem Reiseziel in Array speichern
                                $http.get('http://192.168.178.46:8092/api/v1/user/' + $scope.profiles.user_id).then(function(result) {
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



.controller('ProfileCtrl', function($scope, $http, $auth, $rootScope, $state, $ionicHistory, $stateParams, AppImages, $cordovaContacts, $ionicPlatform, $ionicPopup) {
    
      $scope.images = AppImages.all();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true,
      });


       $scope.loadProfile = function() {  
       /*
       - Wenn keine ID übergeben wird, wird das eigene Profil aufgerufen
       - Wenn noch kein Profil vorhanden, wird $scope.create() aufgerufen 
       - Wenn eine ID übergeben wird, wird das entsprechende Profil zur user id aufgerufen */

      $scope.profils = [];
      $scope.profil = [];
      $scope.user = [];
      $scope.name = null;
      $scope.contact =[];

      
      var user_id = $stateParams.id;
      console.log("stateParams:");
      

      console.log($stateParams.id);
      $scope.user_name = '';
      $scope.user_last_name= '';
      $scope.user_email = '';
      $scope.user_mobilenumber = '';
    


      //Wenn kein Parameter übergeben, wird das eigene Profil angezeigt
      if ($stateParams.id == null){
          $state.go('tab.profile');

        
          var user = localStorage.getItem("user");
          var parseUser = JSON.parse(user);
          var user_id = parseUser.id;
          $scope.user_name = parseUser.name;
          $scope.user_last_name = parseUser.last_name;
          $scope.user_email = parseUser.email;
          console.log("user_id:");
          console.log(user_id);

          $http.get('http://192.168.178.46:8092/api/v1/profil/' + user_id).then(function(result) {
              if(result.data.data.id == null){
                  //console.log("Kein Profil vorhanden");
                  $state.go('tab.create');

              }else{
                 // console.log("Profil vorhanden");
                  $scope.profil = result.data.data;
                  console.log($scope.profil);
                  console.log($scope.profil.id);
              };
          });

        }


        else{
        //Wenn ID übergeben wurde, wird das Profil zur übergebenden User ID geladen
     
          $http.get('http://192.168.178.46:8092/api/v1/user/' + user_id).then(function(result) {
            $scope.user = result.data.data;

            $scope.user_name = $scope.user.name;
            $scope.user_last_name = $scope.user.last_name;

            $scope.user_email= $scope.user.mail;
            console.log($scope.user_email);
            console.log($scope.user);
            console.log($scope.user.name);
         

            $http.get('http://192.168.178.46:8092/api/v1/profil/' + $scope.user.id).then(function(result) {
                console.log($scope.user.id);
                $scope.profil = result.data.data;
                console.log($scope.profil);
                console.log($scope.profil.id);  
                $scope.user_mobilenumber = $scope.profil.mobilenumber;


                //Hier werden die Daten gespeichert, um den jeweiligen Nutzer als Kontakt hinzufügen zu können
                $scope.contact = {
                
                    "name": {
                        "givenName"  : $scope.user_name,
                        "familyName" : $scope.user_last_name,
                    },
                    "phoneNumbers": [
                        {
                            "value": $scope.user_mobilenumber,
                            "type": "mobile"
                        },          
                    ],
                    "emails": [
                        {
                            "value": $scope.user_email,
                            "type": "home"
                        }
                    ],   
                 }     
          
            });

          });

       };


     // console.log("User Name:");
     // console.log($scope.user.name);

        $scope.newProfil={};
          $scope.mobilenumber = '';
          $scope.age = '';
          $scope.sex = '';
          $scope.location='';
          $scope.destination='';
          $scope.startdate='';
          $scope.looking_for = '';
          $scope.interests = '';
          $scope.about = '';
          

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
            mobilenumber: $scope.newProfil.mobilenumber,
            age: $scope.newProfil.age,
            sex: $scope.newProfil.sex,
            location: $scope.newProfil.location,
            destination: $scope.newProfil.destination,
            startdate: $scope.newProfil.startdate,
            looking_for: $scope.newProfil.looking_for,
            interests: $scope.newProfil.interests,
            about: $scope.newProfil.about
        }
        //console.log("Eingabe: ");
        //console.log(credentials);

        var user = localStorage.getItem("user");
        var parseUser = JSON.parse(user);
        var parseUser_id = parseUser.id;
       // console.log("User_id: ");
       // console.log(parseUser_id);

        $http.post('http://192.168.178.46:8092/api/v1/profil/create', {
            user_id: parseUser_id,
            mobilenumber: $scope.newProfil.mobilenumber,
            age: $scope.newProfil.age,
            sex: $scope.newProfil.sex,
            location: $scope.newProfil.location,
            destination: $scope.newProfil.destination,
            startdate: $scope.newProfil.startdate,
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

      $http.get('http://192.168.178.46:8092/api/v1/profil/' + user_id).then(function(result) {
        
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
            mobilenumber: $scope.profil.mobilenumber,
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
       /* console.log("Eingabe: ");
        console.log(credentials);
        */
      

      //Aktuelle User ID:
      var user = localStorage.getItem("user");
      var parseUser = JSON.parse(user);
      var parseUser_id = parseUser.id;
      //console.log("User_id: ");
      //console.log(parseUser_id);

      //Weiterleiten der Daten an Laravel 
      $http.put('http://192.168.178.46:8092/api/v1/profil/edit/' + user_id, {
            mobilenumber: $scope.profil.mobilenumber,
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
            $scope.goProfil();
      }).error(function(){
            console.log("ERROR Profil cannot be updated");
          });

      };

      $scope.createContact = function() {
        var alertPopup ='';
        $ionicPlatform.ready(function() { 
            $cordovaContacts.save($scope.contact).then(function(result) {
                console.log(JSON.stringify(result));
                alertPopup = $ionicPopup.alert({
                    title: 'Contact saved',
                 });

                alertPopup.then(function(res) {

                    console.log('Contact saved successfully');

                });
            }, function(error) {
                  console.log(error);
            });

        });
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
})
