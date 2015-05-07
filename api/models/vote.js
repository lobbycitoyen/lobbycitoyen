'use strict';

/**
 * Module dependencies.
 */
var nconf = require('nconf')
nconf.argv().env().file({file:'config.json'});


var mongoose = require('mongoose'),
Schema = mongoose.Schema,
meta_options = Schema.MetaoptionsSchema;

/**
 * Document Schema
 */

// generate _id
//http://stackoverflow.com/questions/11604928/is-there-a-way-to-auto-generate-objectid-when-a-mongoose-model-is-newed
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;


var VoterSchema = new Schema({
    _id:  {type:ObjectIdSchema, default: function () { return new ObjectId()} },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: Schema.ObjectId,
         trim: true,
        ref: 'User'
    },
    username : {
        type: String,
        default: '-',
        trim: true
    },
    doc_id:{
          type: Schema.ObjectId,
           trim: true,
          ref: 'Document'
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    group: {
        type: Number,
        default: '',
        trim: true
    },
    twitter_account: {
        type: String,
        default: '',
        trim: true
    },
    subgroup: {
        type: String,
        default: '',
        trim: true
    },
    type: {
        type: String,
        default: 'depute',
        trim: true
    },
    subtype: {
        type: String,
        default: '',
        trim: true
    },
    position: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        default: 'unknown',
        trim: true
    },
    
    markup_options: [meta_options]
});

/*
MarkupSchema.virtual('metadata')
  .set(function() {
    this.padsss= 'password';
    this.salt = 'this.makeSalt()';
    this.hashed_password = 'this.encryptPassword(password)';
  })
  .get(function() { return this.salt; });

*/



//MarkupSchema.set('toJSON', { virtuals: true });
var VoteSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        // default: 'Your title',
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        // default: 'your-title',
        unique: true,
        trim: true
    },
    content: {
        type: String,
        default: 'Your content..',
        trim: true
    },
    excerpt: {
        type: String,
        default: '[&hellip;]',
        trim: true
    },
    voters: [VoterSchema], 
    doc_options: [meta_options], 
    published:{
        type: String,
        default: 'public'
    },
    secret: {type:ObjectIdSchema, default: function () { return new ObjectId()} },
    thumbnail: {
        type: String,
         default: 'http://hacktuel.fr/img/logos/loguy/hacktuel.png'
    },
    lang: {
        type: String,
        default: 'en'
    },
    lang_versions: [{
        type: Schema.ObjectId,
        ref: 'Document'
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    editors: [{
       type: Schema.ObjectId,
        ref: 'User'
    }],
    username: {
        type: String
    },
    room: {
        type: Schema.ObjectId,
        ref: 'Room'
    },
    parents: {
        type: Schema.ObjectId,
        ref: 'Document'
    },
    childs: [{
        type: Schema.ObjectId,
        ref: 'Document'
    }],
    clone_of: {
        type: Schema.ObjectId,
        ref: 'Document'
    },
    clones: [{
        type: Schema.ObjectId,
        ref: 'Document'
    }]
});
VoteSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');



mongoose.model('Voter',VoterSchema);
mongoose.model('Vote', VoteSchema);