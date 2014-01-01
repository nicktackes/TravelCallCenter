var uuid = require('node-uuid');
var _ = require('underscore')._;
var dbutils = require('../dbutils.js').dbUtils;
var async = require('async')
var _Client = function () {
    var emitter;
    var models;
    return{
        meta:function () {
            return    {
                name:'client',
                idProperty:'_id',
                fields:{
                    id:{type:'string'},
                    firstName:{type:'string'},
                    lastName:{type:'string'}
                }
            }
        },
        setDb:function (db) {
            dbutils.setDb(db)
        },
        init:function () {

        },
        setModels:function (models) {
            _Client.models = models
        },
        setEmitter:function (emitter) {
            _Client.emitter = emitter;
        },
        save:function (id, data, clientback) {
            if (id == '0' || !id) {
                data.id = uuid.v4()
            }
            dbutils.getDb().collection(_Client.meta().name, function (err, collection) {
                if (err) {
                    clientback(err)
                }
                else {
                    data.id = id
                    collection.update({id:id}, {$set:data}, {upsert:true, multi:false, safe:true}, function(err){
                        clientback(err,data)
                    });
                }
            });
        },
        createRecord:function (data, clientback) {
            dbutils.dataCreate(_Client.meta(), data, function (err, record) {
                if (err) {
                    clientback(err)
                    return
                }
                clientback(null, record)

            })
        },
        getPage:function (queryJson, options, clientback) {
            dbutils.dataRead(_Client.meta(), queryJson, options, clientback)
        },
        getRecord:function (queryJson, options, clientback) {
            dbutils.dataRead(_Client.meta(), queryJson, options, clientback)
        },
        deleteRecord:function (queryJson, clientback) {
            dbutils.dataDelete(_Client.meta(), queryJson, {}, function (err, result) {
                clientback(err);
            })
        }
    }
}();

exports.Client = _Client;