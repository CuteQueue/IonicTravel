angular.module('starter.services', [])


.factory('AppImages', function() {
  
  var images = [{
    id: 0,
    pic: 'img/login_img_h.jpg'
  },{
    id: 1,
    pic: 'img/login_hg.jpg'
  },{
    id: 2,
    pic: 'img/train_img.jpg'
  },{
    id: 3,
    pic: 'img/TM_register.jpg'
  },{
    id: 4,
    pic: 'img/user_img.jpg'
  }];

  return {
    all: function() {
      return images;
    },
    get: function(imageId) {
      for (var i = 0; i < images.length; i++) {
        if (images[i].id === parseInt(imageId)) {
          return images[i];
        }
      }
      return null;
    }
  };
});

