var express = require('express')
var connect = require('connect')
var jade = require('jade')
var app = express()
var stylus = require('stylus')
//TODO: utilize connection timeout
var connectTimeout = require('connect-timeout')
var events = require('events')
var eventEmitter = new events.EventEmitter();

var fs = require('fs');
var util = require('util')
var path = require('path')
var _ = require('underscore')._;
var url = require('url')
var siteConfig = require('./config/siteConfig.json')
var r = require('ua-parser')
var secret = 'whistling rhubarb'

expressRedisStore = require('connect-redis')(express);

// route exports
var routes = {}
routes.user = require('./src/routes/user');
routes.call = require('./src/routes/call');
routes.calltype = require('./src/routes/calltype');
routes.client = require('./src/routes/client');

// model exports
app.models = {}
var dbutils = require('./src/dbutils.js').dbUtils;
app.models.User = require('./src/models/User').User;
app.models.Call = require('./src/models/Call').Call;
app.models.CallType = require('./src/models/CallType').CallType;
app.models.Client = require('./src/models/Client').Client;


express.logger.token('serverdate', function () {
    var d = new Date()
    var timezoneOffset = (d).getTimezoneOffset() * 60000;
    var newDate = new Date(d - timezoneOffset)
    return newDate.toUTCString()
});

// express configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    var rStoreOptions = {
        maxAge:24 * 60 * 60 * 1000
    };
    if (process.env.REDISTOGO_URL) {
        var rtg = url.parse(process.env.REDISTOGO_URL);
        rStoreOptions.port = rtg.port;
        rStoreOptions.host = rtg.hostname;
        rStoreOptions.pass = rtg.auth.split(":")[1];
    }

    app.use(express.session({
        secret:secret,
        store:new expressRedisStore(rStoreOptions)
    }));
    app.use(express.logger({
        format:':remote-addr - - [:serverdate] ":method :url :status :res[content-length] :response-time ms'
    }))

    app.use(express.methodOverride());
    app.use(stylus.middleware({
        src:__dirname + '/public'
    }));
    app.use(app.router);
    app.use(connect.compress())
    app.use(express.static(__dirname));
    app.set('view options', {
        layout:false
    });
});


// session checker - loads the current user in the request

function sessionCheck(req, res, next) {
    if (req.session.user_id) {
        app.models.User.getRecord({
            id:req.session.user_id
        }, {}, function (err, result) {
            if (result && result.total == 1) {
                req.currentUser = result.rows[0];
                next();
            } else {
                app.sessionstatus.emit('sessioninfo', {
                    authenticated:false
                });
                res.end();
            }
        });
    } else {
        app.sessionstatus.emit('sessioninfo', {
            authenticated:false
        });
        res.end();
    }
}

function browserCheck(req, res, next) {
    var ua = r.parse(req.headers['user-agent'])
    if (ua.family == 'Chrome' || ua.family == 'Chrome Frame' || ua.family == 'Safari' || ua.family == 'Mobile Safari' || ua.family == 'Firefox' || (ua.family == 'IE' && _.isNumber(ua.major) && ua.major >= 9)) {
        next()
    } else {
        res.render('notsupported.jade');
    }
}

function loadUser(req, res, next) {
    if (req.session.user_id) {
        app.models.User.getRecord({
            id:req.session.user_id
        }, {}, function (err, result) {
            if (result && result.total == 1) {
                req.currentUser = result.rows[0];
                next();
            } else {
                next();
            }
        });
    } else {
        next();
    }
}

function validateModel(model) {
    var meta = _.isFunction(model.meta) ? model.meta() : null
    if (meta && !meta.idProperty) {
        return 'No idProperty is defined for model ' + meta.name
    }

    return null
}

// root route
app.get('/', browserCheck, function (req, res) {
    var userType = 'GUEST'
    if (req.currentUser) userType = req.currentUser.type
    if (siteConfig.debug) res.render('tc-debug.jade', {
        user_type:userType,
        cdnLocation:siteConfig.cdn || ''
    })
    else res.render('tc.jade', {
        user_type:userType,
        cdnLocation:siteConfig.cdn || ''
    })
});

app.get('/test', function (req, res) {
    var userType = 'GUEST';
    if (siteConfig.debug) res.render('runner.jade', {
        // user_type: userType,
        cdnLocation:siteConfig.cdn || ''
    })
    else res.render('404.jade')
});

// Call Type Routes
app.get('/json/calltype', routes.calltype.list);
app.get('/json/calltype/?:id', routes.calltype.load);
app.post('/json/calltype/action/delete', sessionCheck, routes.calltype.delete);
app.post('/json/calltype/?:id/action/save', sessionCheck, routes.calltype.save);

// Call Routes
app.get('/json/call', routes.call.list);
app.get('/json/call/?:id', routes.call.load);
app.post('/json/call/action/delete', sessionCheck, routes.call.delete);
app.post('/json/call/?:id/action/save', sessionCheck, routes.call.save);


// Call Routes
app.get('/json/client', routes.client.list);
app.get('/json/client/?:id', routes.client.load);
app.post('/json/client/action/delete', sessionCheck, routes.client.delete);
app.post('/json/client/?:id/action/save', sessionCheck, routes.client.save);

// User Routes
app.get('/json/users', sessionCheck, routes.user.list);
app.post('/json/users/?:id/action/save', routes.user.save);
app.post('/json/users/action/delete', sessionCheck, routes.user.delete);
app.get('/json/user', sessionCheck, routes.user.loadSessionUser);
app.get('/json/user/?:id', sessionCheck, routes.user.load);
app.post('/json/sessions', routes.user.session);
app.post('/json/forgot', routes.user.forgot);
app.get('/json/sessions/action/delete', sessionCheck, routes.user.endSession);

var port = process.env.PORT || siteConfig.port;
var io = require('socket.io').listen(app.listen(port, function () {
    if (!module.parent) {
        dbutils.connect(function (err, db) {
            if (err) throw err;
            var valString
            console.log('mongodb connection established!');
            for (var k in app.models) {
                // validate the model
                valString = validateModel(app.models[k])
                if (valString) {
                    throw valString
                }
                // initialize
                if(app.models[k].setEventEmitter){
                    app.models[k].setEventEmitter(eventEmitter)
                }
                app.models[k].init()
//                if(k=='Call'){
//                    app.models[k].setCrudEmitter(app.callcrud)
//                }
                app.models[k].setModels(app.models)
                app.models[k].setDb(db)
            }

            // verify that at least one admin user exists in the User table.  If not, then create and email credentials to
            // the default user.
            //TODO: convert the init logic to we a series async block with a single failure callback.  then, move User.Initialize
            // logic to User.init
            setTimeout(function(){
                    app.models.User.initialize(function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                }, 10000
            )
        })
    }

}));
console.log('Using connect %s, Express %s, Jade %s', connect.version, express.version, jade.version);

io.configure(function () {
    io.enable('browser client minification'); // send minified client
    io.enable('browser client etag'); // apply etag caching logic based on version number
    io.enable('browser client gzip'); // gzip the file
    io.set('log level', 1); // reduce logging

    // enable all transports (optional if you want flashsocket support, please note that some hosting
    // providers do not allow you to create servers that listen on a port different than 80 or their
    // default port)
    if (siteConfig.heroku) {
        io.set("transports", ['websocket',"xhr-polling"]);
        io.set("polling duration", 10);
    } else {
        io.set('transports', [
            'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
        ]);
    }
});

app.callcrud = io.of('/callcrud');

app.sessionstatus = io.of('/sessionstatus');

exports.app = app