'use strict';



// require all controllers

var index   = require('../api/controllers/index');
var voteCtrl   = require('../api/controllers/vote');
var users   = require('../api/controllers/users');


module.exports = function(app, passport, auth) {
    

    app.get('/login', users.login );
    app.post('/register', users.create);
    app.get('/signup', users.signup );
	// USER
    app.get('/signout', users.signout);
    //Setting the facebook oauth routes
    /*
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
        failureRedirect: '/'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/'
    }), users.authCallback);
     */
   
    //Finish with setting up the username param
    //app.param('username', users.userByName);
    //app.param('userId', users.userById);


    app.get('/me/account', auth.requiresLogin, users.account);
    app.get('/api/v1/me/account', auth.requiresLogin, users.account_api);

  
   
    app.get('/',                            voteCtrl.home);

    //app.get('/doc/create',  auth.requiresLogin, docs.doc_create_view ); 


    // routes errors
    app.get('/vote',                         index.errors);
    app.get('/votes',                        index.errors);

    // views & partials


    app.get('/vote/:slug/:widget?/:type?',                   voteCtrl.single);




    app.get('/partials/:sub?/:name/:param?', index.partial); // document, lists, etc..

    app.get('/fragments/:name/:param?',     index.fragments); // load sub-blocks 
    app.get('/doc/fragments/:name/:param?', index.fragments); // load sub-blocks ? express/angualar..?

  

    app.get('/api/v1/votes',                         voteCtrl.list_api);

    // DOC
    // single doc record
    app.get ('/api/v1/vote/:slug',                  voteCtrl.single_api);

    app.post('/api/v1/vote/:doc_id/edit',            auth.requiresLogin_or_secret,  voteCtrl.edit);


   // app.post('/api/v1/doc/:doc_id/edit',            auth.requiresLogin_or_secret,  docs.doc_edit);
        app.post('/api/v1/vote/:slug/delete',         auth.requiresLogin_or_secret,voteCtrl.vote_delete);
    


    
    // create a doc
    //app.post('/api/v1/doc/create',  auth.requiresLogin, docs.doc_create);



     app.get('/sockets/list', index.sockets_list);
     app.get('/sockets/list/doc/:slug', index.sockets_list);

    //
    app.post('/api/v1/userlogin', passport.authenticate('local', {}), users.signin_login);


    // user OFF
    // app.get('/api/v1/users', users.list);
     
  	// first boot
    app.post('/voteinit', voteCtrl.init );


};