// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'satellizer'])


.run(function($ionicPlatform, $rootScope, $auth, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //Überprüfung, ob User schon eingeloggt ist
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        console.log("TEST");
      if (toState.authRequired && !$auth.isAuthenticated()){ 
        // User isn’t authenticated
        console.log("Nicht eingeloggt");
        $state.transitionTo("auth");
        event.preventDefault(); 
      }
    });
})

.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $authProvider.loginUrl = 'http://localhost:8000/api/v1/authenticate';
  $authProvider.signupUrl = 'http://localhost:8000/api/v1/user';
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

   .state('auth', {
      cache:false,
      url: '/auth',
          templateUrl: 'templates/login.html',
          controller: 'AuthCtrl'
    })

    .state('register', {
      //cache:false,
      url: '/register',
          templateUrl: 'templates/register.html',
          controller: 'SignupCtrl'
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl',
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    cache:false,
    url: '/dash',
    authRequired: true,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl',
      }
    }
  })


  .state('tab.chats', {
      cache:false,
      url: '/chats',
      authRequired: true,
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl',
        }
      }
    })
    .state('tab.chat-detail', {
      cache:false,
      url: '/chats/:chatId',
      authRequired: true,
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl',
        }
      }
    })

 
  .state('tab.findMate', {
    url: '/findMate',
    authRequired: true,
    views: {
      'findMate': {
        templateUrl: 'templates/findMate.html',
        controller: 'findMateCtrl',
      }
    }
  })

  

   .state('tab.mate-profile', {
    //cache: false,
    url: '/findMate/mate-profile/:id',
    authRequired: true,
    views: {
      'findMate': {
        templateUrl: 'templates/tab-mate-profile.html',
        controller: 'ProfileCtrl',
      }
    }
  })

  .state('tab.mate-contact', {
    //cache: false,
    url: '/findMate/contact/:id',
    authRequired: true,
    views: {
      'findMate': {
        templateUrl: 'templates/contact.html',
        controller: 'ContactCtrl',
      }
    }
  })
  

  .state('tab.profile', {
    cache:false,
    url: '/profile',
    authRequired: true,
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl',
      }
    }
  })

  .state('tab.create', {
    url: '/profile/create',
    authRequired: true,
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile-create.html',
        controller: 'ProfileCtrl',
      }
    }
  })

  .state('tab.update', {
    url: '/profile/update',
    authRequired: true,
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile-update.html',
        controller: 'ProfileCtrl',
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise('/tab/dash');


});
