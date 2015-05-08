'use strict';

/*

AngularJs controllers 
	
*/
var inheriting = {};
var GLOBALS;
var _;
angular.module('lobbycitoyen.document_controller', []);
function HomeCtrl($scope, $http , $sce, $location, $routeParams, $timeout, VoteRest, vendorService) {

		var promise = VoteRest.votes_home({},{ }).$promise;
   				 promise.then(function (Result) {
			       if(Result){
			          console.log(Result)
			          $scope.votes = Result.votes;
					}
			}.bind(this));
		    promise.catch(function (response) {     
		      console.log(response);
		    }.bind(this));
}

function VoteCtrl($scope, $http , $sce, $location, $routeParams, $timeout, VoteRest, vendorService) {
		
		$scope.ui = {}
		$scope.ui.ready = false;
		$scope.ui.count = {}
		$scope.ui.positions_available = ['Pour', 'Contre', 'Abstention']
 

		$scope.edit = function(type, id, value){
			var data = {}
			var idv = $scope.vote._id;
			var promise = VoteRest.vote_edit({Id:idv},{ 'type': type, 'id':id, 'value':value }).$promise;
   				 promise.then(function (Result) {
			       if(Result){
			          $scope.vote = Result.vote
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

		$scope.apply_filters = function(){
					 $scope.vote.updated_moment = 'Mis à jour il y a ' +moment($scope.vote.updated).fromNow(); // 4 years ago()
					 $scope._.each($scope.vote.voters, function(v,i){
			          		v.visible = true;

			          })
					 var counts = {}

					counts.current = $scope.vote.voters.length
					counts.all = $scope.vote.voters.length


					counts.all_deputes = new Object({'total':0, 'pour':0, 'contre':0, 'abstention':0})
					counts.all_deputes.total =  _.filter($scope.vote.voters, function(v){ return v.type == 'depute'; }).length
					counts.all_deputes.pour =  _.filter($scope.vote.voters, function(v){ return v.type == 'depute' && v.position == 'Pour' }).length
					counts.all_deputes.contre =  _.filter($scope.vote.voters, function(v){ return v.type == 'depute' && v.position == 'Contre'  }).length
					counts.all_deputes.abstention =  _.filter($scope.vote.voters, function(v){ return v.type == 'depute' && v.position == 'Abstention'  }).length

					counts.all_citoyens = new Object({'total':0, 'pour':0, 'contre':0, 'abstention':0})
					counts.all_citoyens.total =  _.filter($scope.vote.voters, function(v){ return v.type == 'citoyen'; }).length
					counts.all_citoyens.pour =  _.filter($scope.vote.voters, function(v){ return v.type == 'citoyen' && v.position == 'Pour' }).length
					counts.all_citoyens.contre =  _.filter($scope.vote.voters, function(v){ return v.type == 'citoyen' && v.position == 'Contre'  }).length
					counts.all_citoyens.abstention =  _.filter($scope.vote.voters, function(v){ return v.type == 'citoyen' && v.position == 'Abstention'  }).length

					
					$scope.ui.count = counts

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

			        
			        vendorService.getLibs().then(function(libs){
        				$scope.jQueryVersion = libs.$.fn.jquery;
        				$scope._= libs._;
        				$scope.m= libs.moment;

        				 $scope.apply_filters()
    					// loadg()
    					$scope.ui.ready = true;
    				  });		
			   
					}
			}.bind(this));
		    promise.catch(function (response) {     
		      console.log(response);
		    }.bind(this));
		}

		$scope.filter_ = function(filter){
			$scope.ui.count.current = 0;

			$scope._.each($scope.vote.voters, function(v,i){
					v.visible = false;
					if(filter == 'reset'){
						v.visible = true;
					}
					if(filter == 'h-only' && i == 2 ){
						v.visible = true;

					}
					if(filter == 'deputes-only' && v.type == 'depute' ){
						v.visible = true;

					}
					if(filter == 'citoyens-only' && v.type == 'citoyen' ){
						v.visible = true;

					}
					if(filter == 'deputes-pour' && v.type == 'depute' && v.position == 'Pour' ){
						v.visible = true;

					}
					if(filter == 'deputes-contre' && v.type == 'depute' && v.position == 'Contre' ){
						v.visible = true;

					}
					if(filter == 'deputes-abstention' && v.type == 'depute' && v.position == 'Abstention' ){
						v.visible = true;

					}

					if(filter == 'citoyens-pour' && v.type == 'citoyen' && v.position == 'Pour' ){
						v.visible = true;

					}
					if(filter == 'citoyens-contre' && v.type == 'citoyen' && v.position == 'Contre' ){
						v.visible = true;

					}
					if(filter == 'citoyens-abstention' && v.type == 'citoyen' && v.position == 'Abstention' ){
						v.visible = true;

					}
					

					if(v.visible){
						$scope.ui.count.current++;
					}
				
			})
		}
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
      doc_delete:{
        method:"POST",
        url: api_url+'/doc/:Id/delete',
         params :  {Id:'@id'},
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
