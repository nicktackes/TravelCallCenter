var uuid = require('node-uuid');
var _ = require('underscore')._;
var dbutils = require('../dbutils.js').dbUtils;
var async = require('async')
var _CallType = function () {
    var emitter;
    var models;
    return{
        meta:function () {
            return    {
                name:'calltype',
                idProperty:'_id',
                fields:{
                    id:{type:'string'},
                    name:{type:'string'}
                }
            }
        },
        setDb:function (db) {
            dbutils.setDb(db)
        },
        init:function () {

        },
        setModels:function (models) {
            _CallType.models = models
        },
        setEmitter:function (emitter) {
            _CallType.emitter = emitter;
        },
        save:function (id, data, callback) {
            if (id == '0' || !id) {
                data.id = uuid.v4()
            }
            dbutils.getDb().collection(_CallType.meta().name, function (err, collection) {
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
            dbutils.dataCreate(_CallType.meta(), data, function (err, record) {
                if (err) {
                    callback(err)
                    return
                }
                callback(null, record)

            })
        },
        getPage:function (queryJson, options, callback) {
            dbutils.dataRead(_CallType.meta(), queryJson, options, callback)
        },
        getRecord:function (queryJson, options, callback) {
            dbutils.dataRead(_CallType.meta(), queryJson, options, callback)
        },
        deleteRecord:function (queryJson, callback) {
            dbutils.dataDelete(_CallType.meta(), queryJson, {}, function (err, result) {
                callback(err);
            })
        }
    }
}();

exports.CallType = _CallType;