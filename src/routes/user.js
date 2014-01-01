var helpers = require('./helpers')
var _ = require('underscore')._;

var models = {}
models.user = require('../models/User').User;
// send email support
var mailConfig = require('../../config/mailConfig.json');
var siteConfig = require('../../config/siteConfig.json');
var emailUtils = require('../emailUtils.js').emailUtils;
var querystring = require("querystring");

exports.list = function(req, res){
    helpers.page(models.user, req, res)
}

exports.save = function (req, res) {
    var data = req.body
    var id = req.params.id;
    var isNew = (id == '0' || !id)
    var changePassword = (data.changePassword == "true");
    if (!changePassword && !isNew) {
        delete data.password
    }
    delete data.changePassword;
    models.user.save(id, data, changePassword, function (err, user) {
        if (err) {
            res.send({error:[
                {message:'We could not create an account due to the following reason.  ' + err}
            ]});

            return;
        }
        if (isNew) {
            emailUtils.sendEmail({from:mailConfig.accounts.sales, template:'account-info.html', to:user.email, subject:'MolecularMatch New Account Information', body:'Welcome to MolecularMatch'}, data);
        }
        res.send(user);
    });
}

exports.delete = function (req, res) {
    var ids = _.isArray(req.body.ids) ? req.body.ids : [req.body.ids]
    res.writeHead(200, {'content-type':'text/plain'});
    var query = {}
    if(ids.length==1){
        query.id = ids[0]
    }
    else{
        query = {id:{$in: ids}}
    }
    models.user.deleteRecord(query, function (err) {
        var result = (err ? {error:[
            {message:err}
        ]} : {})
        res.write(JSON.stringify(result));
        res.end();
    });

}

exports.load = function (req, res) {
    res.writeHead(200, {'content-type':'text/plain'});
    models.user.getRecord({id:req.params.id}, {}, function (err, result) {
        result && result.total == 1 && result.rows.length > 0 ? result = result.rows[0] : result={}
        res.write(JSON.stringify(result));
        res.end();
    });
}

exports.loadSessionUser = function (req, res) {
    var user = _.clone(req.currentUser)
    delete user.salt
    delete user.password
    res.send(user)
}

exports.session = function (req, res) {
    models.user.authenticate(req.body.email, req.body.password, function (err, authenticated, user) {
        if (authenticated) {
            req.session.user_id = user.id;
            var result = {}
            res.send(result);
        }
        else {
            if (err) {
                console.log(err)
            }
            req.session.messages = [
                {message:'Incorrect credentials'}
            ];
            res.send({error:[
                {message:'Incorrect credentials'}
            ]});
        }
    })
}

exports.endSession = function (req, res) {
    if (req.session) {
        req.session.destroy(function () {
        });
    }
    res.send({redirect:'/modules/medical/session'});
}

exports.forgot = function (req, res) {
    models.user.getRecord({email:req.body.email}, {}, function (err, result) {
        if(result.total > 0){
            var user = result.rows[0]
            // generate a new password for this user
            var password = au.S4() + au.S4()
            user.set('password', password)
            var data = {password:password, username:user.username}
            user.save(function (err, u) {
                if (err) {
                    res.send({error:[
                        {message:'An error has occurred attempting to reset the password for ' + req.body.email + '.  ' + err}
                    ]});
                    return;
                }
                emailUtils.sendEmail({from:mailConfig.accounts.sales, template:'account-info.html', to:user.email, subject:'MolecularMatch New Account Information', body:'Welcome to MolecularMatch'}, data);
                res.send(u);
            });
        } else {
            res.send({error:[
                {message:'We could not find an account with that email address.'}
            ]});
        }
        result && result.total == 1 && result.rows.length > 0 ? result = result.rows[0] : {}
        res.write(JSON.stringify(result));
        res.end();
    });
}
