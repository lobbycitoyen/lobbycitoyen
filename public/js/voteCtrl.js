'use strict';

/*

AngularJs controllers 
	
*/
var inheriting = {};
var GLOBALS;
var _;
angular.module('lobbycitoyen.document_controller', []);
function HomeCtrl($scope, $http , $sce, $location, $routeParams, $timeout, VoteRest, vendorService) {
		$scope.ui = {}
		$scope.ui.sockets_refresh =false
		

		$scope.ui.ready = false;
		var promise = VoteRest.votes_home({},{ }).$promise;
   				 promise.then(function (Result) {
			       if(Result){
			          console.log(Result)
			          $scope.user_logged = Result.userin;
			          $scope.votes = Result.votes;
			          $scope.ui.sockets_refresh = true
		
		
						$scope.ui.ready =true;
					}
			}.bind(this));
		    promise.catch(function (response) {     
		      console.log(response);
		    }.bind(this));
}

function VoteCtrl($scope, $http , $sce, $location, $routeParams, $locale, $timeout, VoteRest, vendorService, socket) {
		
		$scope.ui = {}
		$scope.ui.sockets_refresh =false
		$scope.ui.lookup = 'Recherche'
		$scope.ui.ready = false;
		$scope.ui.count = {}
		$scope.render_config = new Object()
      	$scope.render_config.i18n =  $locale;
      	$scope.i18n                       = $locale;
		
		
		$scope.ui.positions_available = ['Pour', 'Contre', 'Abstention']
 

		$scope.edit = function(type, id, value){

			if(!$scope.user_logged){
				// api will recheck logged user but frontend redirects too.
         		window.location = root_url+':'+PORT+'/login';
				return
			}
			var data = {}
			var idv = $scope.vote._id;
			var promise = VoteRest.vote_edit({Id:idv},{ 'type': type, 'id':id, 'value':value }).$promise;
   				 promise.then(function (Result) {
			       if(Result){
			          $scope.vote = Result.vote
			          socket.emit('docupdate',Result.vote)

			          console.log(Result.vote)
			          $scope.is_owner = Result.is_owner
					  $scope.user_logged = Result.userin
			          $scope.apply_filters()
			         
					}
			}.bind(this));
		    promise.catch(function (response) {     
		      console.log(response);
		    }.bind(this));
		}
		$scope.editor_= function(field){
			if($scope.ui.editor[field] && $scope.ui.editor[field] == true){
				$scope.ui.editor[field] = false
			}
			else{
				$scope.ui.editor[field] = true
			}
			
		}
		$scope.apply_filters = function(){
					 $scope.ui.editor = {}
					 $scope.has_voted = false;
					 $scope.vote.updated_moment = 'Mis à jour il y a ' +moment($scope.vote.updated).fromNow(); // 4 years ago()
					 $scope.vote.closetime_moment = '' +moment($scope.vote.closetime).fromNow(); // 4 years ago()

					 $scope._.each($scope.vote.voters, function(v,i){
			          			v.visible = true;
			          			v.byme = false;
			          			if(v.type=='citoyen' && $scope.user_logged && $scope.user_logged.username == v.username){
			          				v.byme = true;
			          				$scope.has_voted = v;

			          			}
			          })
					 var counts = {}

					counts.current = $scope.vote.voters.length
					counts.all = $scope.vote.voters.length


					counts.all_deputes = new Object({'total':0, 'pour':0, 'contre':0, 'abstention':0, 'inconnue':0})
					counts.all_citoyens = new Object({'total':0, 'pour':0, 'contre':0, 'abstention':0, 'inconnue':0})
					counts.all_deputes.total =  $scope.getlength('depute', '') 
					counts.all_deputes.pour =   $scope.getlength('depute', 'Pour') 
					counts.all_deputes.contre =   $scope.getlength('depute', 'Contre') 
					counts.all_deputes.abstention =  $scope.getlength('depute', 'Abstention') 
					counts.all_deputes.inconnue =   $scope.getlength('depute', 'Inconnue') 

				
					counts.all_citoyens.total =  $scope.getlength('citoyen', '')  
					counts.all_citoyens.pour =  $scope.getlength('citoyen', 'Pour') 
					counts.all_citoyens.contre =  $scope.getlength('citoyen', 'Contre') 
					counts.all_citoyens.abstention = $scope.getlength('citoyen', 'Abstention') 
					counts.all_citoyens.inconnue = 0
					
					$scope.ui.count = counts

		}

		$scope.getlength = function(t,p){
 				return _.filter($scope.vote.voters, function(v){ return v.type == t && (v.position == p || p == '')  }).length

		}


		$scope.init = function(){
				
				if($routeParams.docid){
		              $scope.ui.is_home = 'false'
		              $scope.ui.is_single = 'true'
		              $scope.ui.slug_load = $routeParams.docid

		        }
		        else{
		            $scope.ui.is_home = 'true'
		            $scope.ui.is_single = 'true'
		            $scope.ui.slug_load = 'homepage'
		        }

			    var promise = VoteRest.get({Id:$scope.ui.slug_load},{  }).$promise;
   				 promise.then(function (Result) {
			       if(Result){
			         
			        $scope.vote = Result.vote
			        $scope.is_owner = Result.is_owner
					$scope.user_logged = Result.userin
			          				console.log($scope.user_logged)

			        
			        vendorService.getLibs().then(function(libs){
        				$scope.jQueryVersion = libs.$.fn.jquery;
        				$scope._= libs._;

        				 $scope.apply_filters()
    					// loadg()
    					$scope.ui.ready = true;
    					$scope.ui.sockets_refresh = true
    				  });		
			   
					}
			}.bind(this));
		    promise.catch(function (response) {     
		      console.log(response);
		    }.bind(this));
		}


		// can do better with more params
		$scope.filter_ = function(filter_bytype, filter_byposition, b){
			
			$scope.ui.count.current = 0;
			$scope._.each($scope.vote.voters, function(v,i){
					v.visible = false;		
					console.log(v.username)		
					if( ( (v.username == b && v.type=='citoyen')   ||  b == '' )  &&  (v.type == filter_bytype ||  filter_bytype == '' ) && ( v.position == filter_byposition ||  filter_byposition == '') ) {
						v.visible = true;		

					}
					if(v.visible){
						$scope.ui.count.current++;
					}
			})
		}


		
		$scope.$watch('ui.lookup', function(newValue, oldValue) {
		if(oldValue && newValue && $scope._){
				$scope._.each($scope.vote.voters, function(v,i){
					
						v.visible = false
						if( (   ( v['name'].search(newValue) !== -1 || v['nom_circo'].search(newValue) !== -1 || v['group'].search(newValue) !== -1) &&  v.type=='depute')  || newValue =='' ||  newValue =='Recherche'){
							v.visible = true
						}
					
				});
		}
	});


	// 
	socket.on('newsback', function (data) {
		console.log('newsback')
		console.log(data);
		if(data.slug == $scope.vote.slug && $scope.ui.sockets_refresh == true){
			$scope.vote.voters = data.voters;
			$scope.vote.updated = data.updated
			$scope.apply_filters()
		}
		

	})



		$scope.init()
	
} 

angular.module('lobbycitoyen.voteRest', [])
.factory("VoteRest", function($resource, $rootScope){

  var parseResponse = function (data) {
    var data_ = angular.fromJson(data);
    return data_
  };

  return $resource(
    {Id:'@id'},
    {},
    {
      get:{
        method:"GET",
        url: api_url+'/vote/:Id/',
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      new_vote:{
        method:"POST",
        url: root_url+':'+PORT+'/voteinit'
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      doc_delete:{
        method:"POST",
        url: api_url+'/doc/:Id/delete',
         params :  {Id:'@id'},
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      account:{
        method:"GET",
        url: api_url+'/me/account',
        //transformResponse: parseResponse
        //interceptor: { response: parseResponse }
        //isArray: false
      },
      vote_edit:{     
        method:"POST",
        url: api_url+'/vote/:Id/edit',  
         params :  {Id:'@id'},
      },
      votes_home:{     
        method:"GET",
        url: api_url+'/votes/',  
      },
      doc_sync:{     
        method:"POST",
        url: api_url+'/doc/:id/sync',  
      },
      doc_option_edit:{     
        method:"POST",
        url: api_url+'/doc/:id/doc_option_edit'
      },
      doc_option_delete:{ 
        method:"POST",
        url: api_url+'/doc/:id/doc_option_delete'
      },
      doc_option_new :{       
        method:"POST",
        url: api_url+'/doc/:id/doc_option_new'
      },
      doc_new :{       
        method:"POST",
        url: api_url+'/doc/create',
      }
    }
  );
})


angular.module('lobbycitoyen.vendorService', [])

.service('vendorService', ['$q', '$timeout', '$window', function($q, $timeout, $window){
    var deferred = $q.defer(), libs = {};
    
    $script([
        'js/jquery-1.5.1.min.js',
       // 'js/raphael-min.js',
        'bower_components/momentjs/moment.js',
		'bower_components/underscore/underscore-min.js'
       // 'js/raphael.tooltip.js',
       // 'js/hemi.js'
    ], 'vendorBundle');

    $script.ready('vendorBundle', function() {
        libs.$ = $window.jQuery.noConflict();
        libs._ = $window._.noConflict();
        $timeout(function(){
            deferred.resolve(libs);
         
        }, 0);
    });
    this.getLibs = function(){
        return deferred.promise;
    }
}])




angular.module('lobbycitoyen.Socket', [])
.factory('socket', function($rootScope, $http, $location)  {
  //  app.locals.port=
  if(SOCKET_URL !==""){
       console.log('loading sockets')
       var socket = io.connect(SOCKET_URL+':'+SOCKET_SERVER_PORT);
  
    return {
      start: function(){
       //console.log(socket)
      },
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
         $rootScope.$apply(function () {
            
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              //alert('on')
              callback.apply(socket, args);
            }
          });
        })
      }
    };

  }
  else {
     console.log('not loading sockets')
    var socket = '';
    return {
      on:  function () {},
      emit:  function () {}

    }
    
  };
});
