var uuid = require('node-uuid');
var _ = require('underscore')._;
var dbutils = require('../dbutils.js').dbUtils;
var async = require('async')
var _Call = function () {
    var emitter;
    var models;
    return{
        meta:function () {
            return    {
                name:'call',
                idProperty:'_id',
                fields:{
                    id:{type:'string'},
                    agent:{type:'string'},
                    action:{type:'string'},
                    creationDate:{type:'date'}
                }
            }
        },
        setDb:function (db) {
            dbutils.setDb(db)
        },
        init:function () {

        },
        setModels:function (models) {
            _Call.models = models
        },
        setEmitter:function (emitter) {
            _Call.emitter = emitter;
        },
        save:function (id, data, callback) {
            if (id == '0' || !id) {
                data.id = uuid.v4()
            }
            dbutils.getDb().collection(_Call.meta().name, function (err, collection) {
                if (err) {
                    callback(err)
                }
                else {
                    data.id = id
                    collection.update({id:id}, {$set:data}, {upsert:true, multi:false, safe:true}, function(err){
                        callback(err,data)
                    });
                }
            });
        },
        createRecord:function (data, callback) {
            dbutils.dataCreate(_Call.meta(), data, function (err, record) {
                if (err) {
                    callback(err)
                    return
                }
                callback(null, record)

            })
        },
        getPage:function (queryJson, options, callback) {
            dbutils.dataRead(_Call.meta(), queryJson, options, callback)
        },
        getRecord:function (queryJson, options, callback) {
            dbutils.dataRead(_Call.meta(), queryJson, options, callback)
        },
        deleteRecord:function (queryJson, callback) {
            dbutils.dataDelete(_Call.meta(), queryJson, {}, function (err, result) {
                callback(err);
            })
        }
    }
}();

exports.Call = _Call;