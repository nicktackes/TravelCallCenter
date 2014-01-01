var dbutils = require('../dbutils.js').dbUtils;
var uuid = require('node-uuid');
var emailUtils = require('../emailUtils.js').emailUtils;
var crypto = require('crypto');
var _ = require('underscore')._;
var defaultUser = require('../../config/defaultUser.json')

var _User = function () {
    var emitter;
    var models;
    return{
        meta:function () {
            return {
                name:'user',
                idProperty:'_id',
                fields:{
                    id:{type:'string'},
                    username:{type:'string'},
                    hashed_password:{type:'string'},
                    salt:{type:'string'},
                    email:{type:'string'},
                    type:{type:'string'},
                    status:{type:'string'}
                }
            }
        },
        setDb:function (db) {
            dbutils.setDb(db)
        },
        init:function(){

        },
        setModels:function (models) {
            _User.models = models
        },
        setEmitter:function (emitter) {
            _User.emitter = emitter;
        },
        initialize:function (callback) {
            _User.getRecord({type:'ADMIN'}, {}, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                if (result.rows.length > 0) {
                    callback()
                }
                else {
                    console.log('No admin users were found.  The default user is being created in the database.')
                    // create the default user in the User table.
                    _User.createRecord(defaultUser, function (err, data) {
                        var mailConfig = emailUtils.getConfig()
                        emailUtils.sendEmail({from:mailConfig.accounts.sales, template:'account-info.html', to:defaultUser.email, subject:'MolecularMatch New Account Information', body:'Welcome to MolecularMatch'}, defaultUser);
                        callback(err)
                    })
                }
            });

        },
        randomPassword:function () {
            S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return S4() + S4()
        },
        validateUniqueUsername:function (username, callback) {
            _User.getRecord({username:username}, {}, function (err, result) {
                callback(err, result.total === 0)
            })
        },
        validateUniqueEmail:function (email, callback) {
            _User.getRecord({email:email}, {}, function (err, result) {
                callback(err, result.total === 0)
            })
        },
        save:function (id, data, changePassword, callback) {
            // set the email address to lower case
            if (data.email) {
                data.email = data.email.toLowerCase()
            }
            if (id == '0' || !id) {
                data.id = uuid.v4()
                _User.createRecord(data, callback);
            }
            else {
                // if changePassword, then alter then encrypt
                if (changePassword) {
                    data.salt = _User.makeSalt()
                    data.hashed_password = _User.encryptPassword(data.password, data.salt)
                }
                dbutils.dataUpdate(_User.meta(), {id:id}, data, callback);
            }
        },
        createRecord:function (data, callback) {
            // hash the password
            var user = _.clone(data)
            user.salt = _User.makeSalt()
            user.hashed_password = _User.encryptPassword(user.password, user.salt)
            _User.validateUniqueUsername(user.username, function (err, valid) {
                if (err || !valid) {
                    if (err) {
                        console.log(err)
                    }
                    callback(err?err:'An account already exists for the username provided', user)
                }
                else {
                    _User.validateUniqueEmail(user.email, function (err, valid) {
                        if (err || !valid) {
                            if (err) {
                                console.log(err)
                            }
                            callback(err?err:'An account already exists for the email address provided', user)
                        }
                        else {
                            dbutils.dataCreate(_User.meta(), user, callback)
                        }
                    })
                }
            })
        },
        getPage:function (queryJson, options, callback) {
            dbutils.dataRead(_User.meta(), queryJson, options, callback)
        },
        getRecord:function (queryJson, options, callback) {
            dbutils.dataRead(_User.meta(), queryJson, options, callback)
        },
        deleteRecord:function (queryJson, callback) {
            // delete the user records in the database
            dbutils.dataDelete(_User.meta(), queryJson, {}, function (err, result) {
                callback(err);
            })
        },
        makeSalt:function () {
            return Math.round((new Date().valueOf() * Math.random())) + '';
        },
        encryptPassword:function (password, salt) {
            return crypto.createHmac('sha1', salt).update(password).digest('hex');
        },
        authenticate:function (email, password, callback) {
            // get the user
            _User.getRecord({email:email}, {}, function (err, result) {
                if (err) {
                    callback(err, false);
                }
                else if (result.rows.length == 1) {
                    callback(null, _User.encryptPassword(password, result.rows[0].salt) === result.rows[0].hashed_password, result.rows[0]);
                }
                else {
                    callback(null, false)
                }
            })
        }
    }
}();

exports.User = _User;