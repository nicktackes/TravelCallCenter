var _emailUtils = function () {
    var nodemailer = require("nodemailer");
    // sendGrid account credentials
    var mailConfig = require('./../config/mailConfig.json')
    var siteConfig = require('./../config/siteConfig.json')
    var transport = nodemailer.createTransport("SMTP", mailConfig.provider);
    var mu = require('mu2');
    var development = mailConfig.developmentMode;

    return {
        setDevelopmentMode:function(isDevelopment){
                development = isDevelopment
        },
        sendEmail:function (config, data, callback) {
            var buffer = '';
            callback = callback || function (err, result) {
                if (err) {
                    console.log(err);
                }
            };

            data._url = siteConfig.url
            data._port = siteConfig.port
            mu.root = __dirname
            mu.compileAndRender(config.template, data)
                .on('data', function (c) {
                    buffer += c.toString();
                })
                .on('end', function () {
                    var cfg = {
                        to:config.to,
                        from:config.from,
                        subject:config.subject,
                        html:buffer
                    }
                    if(config.bcc){
                        cfg.bcc = config.bcc
                    }
                    if(config.attachments){
                        cfg.attachments = config.attachments
                    }
                    if(development){
                        callback()
                    }
                    else{
                        transport.sendMail(cfg, callback);
                    }
                });
        },
        getConfig:function () {
            return mailConfig;
        }
    };
}();

exports.emailUtils = _emailUtils;