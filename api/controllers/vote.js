'use strict';


/**
* @description
* @function 
* @link 
* @todo nothing
*/
/*
API functions

"document" functions

	create, edit, delete ..


"markups"

	crud /	offset

misc. function (access/right)

*/

var mongoose = require('mongoose'),
 _ = require('underscore'),
 S = require('string'),
request = require('request-json'),

Vote = mongoose.model('Vote'),

meta_options = mongoose.model('Metaoptions'),
User = mongoose.model('User'),
Voter  = mongoose.model('Voter');

var nconf = require('nconf');

nconf.argv().env().file({file:'config.json'});

var chalk = require('chalk');
var app;

				var groupslist = new Array('LES-REP','SRC','SOC','SOCV','UDI','CRC','CRC-SPG','ECO','UC','NI')


//var mail= require('./../../sendmail.js');


 	exports.home= function(req, res) {
			var user_ = {};

			 if(req.user){
				user_ = req.user.toObject()
	
			}
		
			res.render('vote', {
				user_in : user_,
				doc_title : 'Accueil',
				raw_content : '',
				doc_thumbnail : '',
				doc_excerpt: '',
				doc_slug_discret : '',
				doc_include_js : '',
				doc_include_css : '' 
			});			
		
		
 	}

	/**
	* @description
	* @function 
	* @link 
	* @todo nothing
	*/
 	exports.single= function(req, res) {

 		var debugger_on = 'true' /// fix database for broken meta_options.

		var user_ = ''
		if(req.user){
			// user_ = new Object({'_id': req.user._id , 'username': req.user.username,  'image_url': req.user.image_url})
		}
		var doc_req_slug 	  = 'homepage';
		var doc_slug_discret  =  nconf.get('ROOT_URL')+':'+nconf.get('PORT');
		if(req.params.slug){
			doc_req_slug = req.params.slug;
			doc_slug_discret  +=  '/vote/'+req.params.slug;
		}

		// miniquery.
		var query = Vote.findOne({ 'slug':doc_req_slug });
			query.populate('user','-email -hashed_password -salt').populate( {path:'voters.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'voters.doc_id', select:'-markups -secret', model:'Vote'}).populate('voters.doc_id.user').exec(function (err, doc) {
			if (err){
				res.json(err)
			} else{
				if(doc){
					if(doc.published == 'draft')
					{
								var user_can	= exports.test_owner_or_key(doc,req)
								if(!user_can){
									var redirect_to = nconf.get('ROOT_URL')+':'+nconf.get('PORT')
									if(req.params.slug){
										redirect_to += '/doc/'+req.params.slug;
									}
									
									 var message = 'This doc is a draft : <a style="text-decoration:underline;" href="/login?redirect_url='+redirect_to+'">login</a> if your are doc owner or grab "secret key" <a style="text-decoration:underline;" href="'+nconf.get('ROOT_URL')+'"> &laquo; Back </a>';
									 res.render('error', { title: 'no access', message: message} );
									 return;
								}
					}


					var doc_include_js=''
					var doc_include_css= '';

					var new_doc_options = []
					_.each(doc.doc_options , function (option, i){
						

						if(option.option_name == 'doc_include_js' ){			 	
							doc_include_js += option.option_value;
						}
						if(option.option_name == 'doc_include_css' ){			 	
							doc_include_css += option.option_value;
						}
					});
					

					


				//	console.log('public doc rendered')	
					res.render('vote', {
						user_in : user_,
						doc_title : doc.title,
						raw_content : doc.content,
						doc_thumbnail : doc.thumbnail,
						doc_excerpt: doc.excerpt,
						doc_slug_discret : doc_slug_discret,
						doc_include_js : doc_include_js,
						doc_include_css : doc_include_css 
					});
				} // has doc
				else{
					res.json(err)
				}
			}
		});
	}


	/**
	* @description  single document record
	* @params : slug $get
	* @function 
	* @link 
	* @todo nothing
	*/

	exports.single_api = function(req, res) {
		var query = Vote.findOne({ 'slug':req.params.slug })
		query.populate('user','-email -hashed_password -salt').populate( {path:'voters.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'voters.doc_id', select:'-markups -secret', model:'Vote'}).populate('voters.doc_id.user').exec(function (err, doc) {
			if (err){
				res.json(err)
			} 
			else{
				if(doc){

					var out 			= {}
					out.vote 			= doc.toObject()
					out.vote.byposition = new Object({Pour:0, Contre:0, Inconnue:0, Abstention:0})

					out.vote.bypositionbygroup = {}

					_.each(groupslist, function(g){
						
						// 
						

					})

					_.each(doc.voters, function(mk) {
						console.log(out.vote.bypositionbygroup[mk.group])
						out.vote.byposition[mk.position] = parseInt(out.vote.byposition[mk.position])+1

						// create array of null
						if(!out.vote.bypositionbygroup[mk.group]){
							out.vote.bypositionbygroup[mk.group] = new Object({Pour:0, Contre:0, Inconnue:0, Abstention:0})
						}

                  	
        			})

					
					// test rights
					if(doc.published =='draft'){
								var user_can	= exports.test_owner_or_key(doc,req)
								if(!user_can){
									var message = 'This doc is a draft, are you the document owner ? are you logged in or using secret key ?';
									res.json('err', { title: 'no access', message: message})
									return;
								}
					}
					

				


					//out.vote.byposition = {'Pour':5}
					// out.vote.bygroup    =   {'UMP':5}




					out.is_owner = false;
					if(req.user){
						 out.userin 	= req.user.toObject()
						 out.is_owner 		= exports.test_owner_or_key(doc,req)
					}
				
					if(out.is_owner == true){
							
					}
					else{
						out.vote.secret 		= 'api_secret'
					}
					res.json(out)
				}
				else{
					res.json('err')
				}
			}
		})
	}

exports.list_api = function(req, res) {

	//var status_only = new Object({'published': 'draft'})
	var status_only = new Object();


	var query = Vote.find( {}, {'voters':0, 'doc_options':0, 'secret':0});
	


	query.populate('user', '-email -hashed_password -salt -user_options').exec(function (err, votes) {

	if (err){
		return handleError(err);
	} 
	else{
		var user_;

			 if(req.user){
				user_ = req.user.toObject()
	
			}
		var out = {}

		out.userin 	= user_
		out.votes_count = votes.length
		out.votes = []
		_.each(votes, function(vote, i){
			out.votes.push(vote)


		});

		res.json(out)
	}


		
	})
};



exports.doc_create = function(req,res){

	// to filter a better way
	var raw_title        =     req.body.raw_title;
	var raw_content      =     req.body.raw_content;

	
	if(req.body.published){
		var published      = req.body.published
	}
	else{
		var published      = 'draft'
	}

 	var filtered_title   =     raw_title;
	var filtered_content =     raw_content;
	var slug             =     S(raw_title).slugify().s 

	

	//var ar = new Object({'title':'bloue'+Math.random()})
	var new_doc = new Object({'title':filtered_title, 'slug': slug, 'content': filtered_content, 'published': published })

	 new_doc.markups = new Array()
	 new_doc.doc_options = new Array()

	 var text_size = _.size(raw_content)-1;

	 var markup_section_base  = new Markup( {'user_id':req.user._id, 'username':req.user.username, 'start':0, 'end':text_size,  'type': 'container', 'subtype':'section', 'position':'inline', 'status':'approved'} )
	 new_doc.markups.push(markup_section_base)


	 // var markup_class= new Object( {'user_id':req.user._id, 'username':req.user.username, 'start':0, 'end':10,  'type': 'container_class', 'subtype':'css_class', 'metadata': 'bg_black', 'position':'inline'} )
	 // new_doc.markups.push(markup_class)

	var text_typography  = new meta_options( {'option_name':'text_typography', 'option_value':'Open Sans',  'option_type': 'google_typo' } )
	


	new_doc.doc_options.push(text_typography)
	


	

	var doc = new Vote(new_doc);
	if(req.user){
		doc.user = req.user;
   	 	doc.username = req.user.username;
   	 	//console.log(req.user)
	}
	else{
		//return res.send('users/signup', {
             //   errors: err.errors,
             //   article: article
          //  });
	}
	//doc.populate('user', 'name username image_url').exec(function(err,doc) {
	doc.save(function(err,doc) {
		if (err) {
   			res.json(err);
        } else {

        	//var email_object = new Object({'subject':'[new document] - ', 'text':'new document created!'})
        	// mail.sendmail(email_object)
			//console.log(doc)
			// var doc =  Document.findOne({title: filtered_title}).populate('user', '-salt name username image_url').populate('room').exec(function(err, doc) {
        	res.json(doc)
   			          
        }
    });
}




exports.vote_delete  = function(req, res) {

// TODO : 	// check owner

	var query = Vote.findOne({ 'slug':req.params.slug });
	query.populate('user', '-email -hashed_password -salt -user_options').exec(function (err, doc) {
		if (err){
			res.json(err)
		} 
		else{
			var right = exports.test_owner_or_key(doc, req)
			if(right){
							doc.remove(function(err) {
			        if (err) {
			            res.jsonp('err deleteing')
			        } else {
			            res.jsonp(doc);
			        }
			    });

			}
			else{
				res.json('doc delete error')
			}
			


		}
	});
}	

exports.edit  = function(req, res) {
	var query = Vote.findOne({ '_id':req.params.doc_id });
	var out = {}
	query.populate('user','-email -hashed_password -salt').populate( {path:'voters.user_id', select:'-salt -email -hashed_password', model:'User'}).populate({path:'voters.doc_id', select:'-voters -secret', model:'Vote'}).populate('voters.doc_id.user').exec(function (err, doc) {
		if (err){
			res.json(err)
		} 
		else if(!req.user){
			res.json(err)
	
		}
		else{

			// TODO CHECK OWNERSHIP !!!


				if(req.body.type && req.body.type =='voter'){
						_.each(doc.voters , function (voter, i){

								if(req.body.value && req.body.id && voter._id == req.body.id){
									voter.position = req.body.value
								}
								

						})
				}

				if(req.body.type && req.body.type =='vote_title'){
						
						doc.title = req.body.value
						var slug             =     S(doc.title).slugify().s 
						doc.slug = slug;

								
				}


				if(req.body.type && (req.body.type =='content' || req.body.type =='excerpt') ) {
						doc[req.body.type] = req.body.value

				}
				if(req.body.type && (req.body.type =='closetime' || req.body.type =='closetime') ) {
						doc[req.body.type] = req.body.value

				}
				if(req.body.type && req.body.type =='new_voter'){
						
						/// CHECK NOT ALREADY IN ARRAY

								var voter_citoyen  = new Voter( {'user_id':req.user._id, 'place_en_hemicycle':0,'nom_circo':'www','subgroup':'www', 'group':'www', 'twitter_account': '-', 'username':req.user.username, 'name': req.user.username,'type': 'citoyen', 'position':req.body.value} )
								doc.voters.push(voter_citoyen)

				}

				 out.is_owner 		= exports.test_owner_or_key(doc,req)
				 doc.updated = new Date().toJSON();
				 doc.save(function(err,doc) {
						if (err) {
							res.send(err)
						} else {

							out.vote = doc
							out.vote.updated = new Date().toJSON();

							out.userin 	= req.user.toObject()
							res.json(out)

						}

				})

		//	console.log(doc)
		}
	})
}


	// UTILs
	exports.test_owner_or_key = function(doc,req){
		// doc owner or markup owner
		if(req.user){
			if(req.user._id.equals(doc.user._id) ){	
				console.log('user is owner')
				return true;	
			}
			else{

				
				if( (req.body.secret && doc.secret==req.body.secret) || (req.query.secret && doc.secret==req.query.secret) ){
					console.log('secret match')
					return true;
				}
				else{
					console.log('and secret dont match(tell no one: '+doc.secret+'   )')
					var err = new Object({'message':'Need to be either doc owner or use right secret key', 'err_code':'100'})
					return false
				}
			}
		}
		return false;
	}

	function getRandomInt(min, max) {
 		return Math.floor(Math.random() * (max - min + 1)) + min;
	}





 exports.init = function (req, res) {
 		console.log('req.body')

 		console.log(req.body)
		 if(req.user){

			var user = req.user
		 }
		 else{
		 		var user = new User({'username':'a-'+Math.random()+'-'+Math.random(), 'email':'a-'+Math.random()+'-'+Math.random()+'dfsdds@sd.fr', 'password':'secrddet'});
			    user.provider = 'local';
		 }
    	var message = null;
   		/*user.save(function(err, user) {
    	req.logIn(user, function(err) {    
            
        });

*/

			

	var raw_title        =     'vote #'+Math.random()+'-'+Math.random();
	var raw_content      =     'Contenu du vote';
	

 	var filtered_title   =     raw_title;
	var filtered_content =     raw_content;
	var slug             =     S(raw_title).slugify().s 

	

	//var ar = new Object({'title':'bloue'+Math.random()})
	var new_doc = new Object({'title':filtered_title, 'slug': slug, 'content': filtered_content, 'published':'public' })

	 new_doc.voters = new Array()
	 new_doc.doc_options = new Array()
	 var text_size = _.size(raw_content)-1;
	 var voter_name  = 'senateur_name_'+Math.random()
	 var include_senateur = false
	 var include_depute = false
	 var include_citoyen = false


	if(req.body.inc_depute && req.body.inc_depute == 'false' && req.body.inc_senateurs && req.body.inc_senateurs == 'false' ){
		// console.log('false')
			var doc = new Vote(new_doc);
			doc.user = user;
		   	doc.username =user.username;
		   	doc.include_citoyen = true
				
			//doc.populate('user', 'name username image_url').exec(function(err,doc) {
				doc.save(function(err,doc) {
					if (err) {
			   			res.json(err);
			        } else {
						console.log('vote created')
						// var doc =  Vote.findOne({title: filtered_title}).populate('user', '-salt name username image_url').populate('room').exec(function(err, doc) {
			        	res.json(doc)
			   			          
			        }
			    });
	}






	else{
			var client = request.createClient(nconf.get('ROOT_URL')+':'+nconf.get('PORT'));
			

			var file = '';
			if(req.body.inc_depute == 'true'){
				file = 'dumps/nosdeputes.fr_deputes_en_mandat2015-06-04.json'
			}
			if(req.body.inc_senateurs == 'true'){
				file = 'dumps/nossenateurs.fr_senateurs_en_mandat2015-06-04.json'
			}
			console.log(file)

			client.get(file, function(err, res__, body) {
			
				
			if(req.body.inc_depute== 'true')	{
				var objs = body.deputes
			}
			if(req.body.inc_senateurs== 'true')	{	
				var objs = body.senateurs
			}

			  _.each(objs, function(obj, i){
			  //	console.log(body.deputes[i])

			var pos_preset = 'Inconnue'
			var type = ''
			

			if(req.body.inc_citoyen && req.body.inc_citoyen == 'true')	{
				new_doc.include_citoyen = true
			}

			if(req.body.inc_depute && req.body.inc_depute == 'true')	{
				var depute = objs[i].depute
				type = 'depute'
				new_doc.include_depute = true
			}
			if(req.body.inc_senateurs && req.body.inc_senateurs == 'true')	{
				
				var depute = objs[i].senateur
				type = 'senateur'
				new_doc.include_senateur = true

			}


				_.each(groupslist, function(group){
					var req_body = req.body
					var req_body_sigle = req_body[group]
					
					if(req_body_sigle && depute.groupe_sigle == group){
						
						 pos_preset = ''+req_body_sigle
			  		}
				})




			  	var twitter_account = '';
			  	if(depute.twitter !==""){
			  		 twitter_account = depute.twitter
			  	}
		

			  	var voter_b  = new Voter( {'user_id':user._id, 'place_en_hemicycle':depute.place_en_hemicycle,'nom_circo': depute.nom_circo,'subgroup':depute.parti_ratt_financier, 'group':depute.groupe_sigle, 'twitter_account': twitter_account, 'username':user.username, 'slug': depute.slug ,'name': depute.nom, 'type': type, 'position':pos_preset} )
				new_doc.voters.push(voter_b)
				
			  		
			  })

				// var voter_citoyen  = new Voter( {'user_id':user._id, 'place_en_hemicycle':0,'nom_circo':'www','subgroup':'www', 'group':'www', 'twitter_account': '-', 'username':user.username, 'name': user.username,'type': 'citoyen', 'position':'inconnue'} )
				// new_doc.voters.push(voter_citoyen)



			var doc = new Vote(new_doc);
			doc.user = user;
		   	doc.username =user.username;
				
			//doc.populate('user', 'name username image_url').exec(function(err,doc) {
				doc.save(function(err,doc) {
					if (err) {
			   			res.json(err);
			        } else {
						console.log('vote created')
						// var doc =  Vote.findOne({title: filtered_title}).populate('user', '-salt name username image_url').populate('room').exec(function(err, doc) {
			        	res.json(doc)
			   			          
			        }
			    });



			}); // get end.

	}


	


   // save user old });


}
