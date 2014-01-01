var helpers = require('./helpers')
var url = require('url')
var _ = require('underscore')._;
var uuid = require('node-uuid');
var async = require('async')

var models = {}
models.client = require('../models/Client').Client;

exports.list = function(req, res){
    helpers.page(models.client, req, res)
}

exports.load = function (req, res) {
    models.client.getRecord({id:req.params.id}, {}, function (err, result) {
        if (err) {
            res.send({error:[
                {message:err}
            ]});

            return;
        }
        result && result.total == 1 && result.rows.length > 0 ? result = result.rows[0] : result={}
        res.send(result);
    });
}

exports.save = function (req, res) {
    var data = req.body
    var id = req.params.id;
    models.client.save(id, data, function (err, drug) {
        if (err) {
            res.send({error:[
                {message:'We could not create a client due to the following reason.  ' + err}
            ]});

            return;
        }
        res.send(drug);
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
    models.client.deleteRecord(query, function (err) {
        var result = (err ? {error:[
            {message:err}
        ]} : {})
        res.write(JSON.stringify(result));
        res.end();
    });

}
