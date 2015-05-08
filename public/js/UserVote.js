'use strict';

/*
* AngularJs controllers for "user" view 

  - UserProfileCtrl
    > get account infos (name, mail,..., and documents)

  - UserCtrl (before logged, handle both login and signup forms)
  
*/


// ** GLOBAL MISC VARS
var inheriting = {};
var GLOBALS;
var render;


angular.module('lobbycitoyen.user_controller', []);
function UserProfileCtrl($scope, $http , $location, $routeParams,  $locale, UserRest, UserService ) {
     
      $scope.render_config = new Object()
         $scope.render_config.i18n =  $locale;
        $scope.i18n                       = $locale;


    $scope.globals = GLOBALS;
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    
    var promise = UserRest.account({},{  }).$promise;
      promise.then(function (Result) {
          
          var this_user = new UserService()
          this_user.SetFromApi(Result.user)
          this_user.MapOptions(Result)
          

     }.bind(this));
     promise.catch(function (response) {     
          console.log(response);
     }.bind(this));

        $scope.delete_document= function(doc){
       
        }

        $scope.external_link = function (link){
      window.location = link;
    }

    $scope.create_doc = function(){
      alert('off')
      //var newdoc_service =  new DocumentService('n')
      //newdoc_service.newdoc();
  }


}
function UserCtrl($scope, $http , $location, $routeParams,  $locale, UserService) {
  
  console.log('User Controller')

  // call a render 

  // get user
  new UserService().SetFromLocale()

          $scope.render_config = new Object()
         $scope.render_config.i18n =  $locale;
        $scope.i18n                       = $locale;
  
  $scope.register_url = root_url+':'+PORT+'/signup';
  $scope.created_user_link   = root_url+':'+PORT+'/me/account?welcome';

  if($routeParams.redirect_url){
    $scope.created_user_link  = $routeParams.redirect_url;
    $scope.register_url     += '?redirect_url='+$routeParams.redirect_url

  }

  //  $scope.render_config = new Object({'i18n':  $locale})



  $scope.globals = GLOBALS;
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  $scope.errors= '';
  $scope.password  ='';
  $scope.username = '';
  $scope.complete = false;

  $scope.checklogin = function(){
    var data = new Object({'username': $scope.username, 'password': $scope.password, 'redirect_url':$routeParams.redirect_url})
    //console.log($routeParams.redirect_url)
    $http.post(root_url+':'+PORT+'/api/v1/userlogin', serialize(data) ).success(function(e) {
          //console.log(e)
          window.location = e.redirect_url;
         }).error(function(data, status) {});  
  }

  $scope.checkregister = function (){
    
    if($scope.password && $scope.username && $scope.password !=="" && $scope.username !=="" ){
      $scope.errors= ''
      var data = new Object()
      data.username   = $scope.username;
      data.password   = $scope.password;
      data.email    = $scope.email;
      data.newsletter = $scope.newsletter ? $scope.newsletter : false ;
      $http.post(root_url+':'+PORT+'/register', serialize(data) ).success(function(e) {
            $scope.complete = true;
            window.location = $scope.created_user_link 

          });  
    }
    else{
      $scope.errors= 'complete the fields please'
    }
  }
  
}



angular.module('lobbycitoyen.UserRest', [])
.factory("UserRest", function($resource, $rootScope){

  var parseResponse = function (data) {
    var data_ = angular.fromJson(data);
    return data_
  };

  return $resource(
    {},
    {},
    {
      account:{
        method:"GET",
        url: api_url+'/me/account',
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      }
    }
  );

})


angular.module('lobbycitoyen.UserService', [])
.factory("UserService", function($rootScope,$locale) {

        
  var UserService = function() {
     console.log('UserService')
     $rootScope.userin = new Object({'username':''});
  };


  UserService.prototype.SetFromApi = function(data) {
      if(data){
          $rootScope.userin = data;
      }
   };

  UserService.prototype.SetFromLocale = function() {
     if(USERIN){
       $rootScope.userin = USERIN;
     }
  }

 UserService.prototype.MapOptions = function(data) {
          $rootScope.documents = [];
          $rootScope.documents = data.user_documents;
          var options_array = [];
          _.each(data.user.user_options , function(option){
            //console.log(option)
             // console.log(option)
              var op_name = option.option_name;
              var op_value = option.option_value;
              var op_type = option.option_type;
              options_array[op_name]= [];
              options_array[op_name]['value'] = op_value;
          });
          $rootScope.user_options = [];
          $rootScope.user_options = options_array
  }

  return UserService;

});



// MISC UTILS
function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%')
}
function serialize(obj, prefix) {
  var str = [];
  for(var p in obj) {
    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p]
    str.push(typeof v == "object" ?
      serialize(v, k) :
      encodeURIComponent(k) + "=" + encodeURIComponent(v))
  }
  return str.join("&")
}
