var _ = require('underscore')._;
var siteConfig = require('./../config/siteConfig.json');
var mongodbConfig = require('./../config/mongodbConfig.json');
var mongodb = require('mongodb');
var url = require('url')

var _dbutils = function () {
    var totalVariable = 'total'
    var rowsVariable = 'rows'
    var idProperty = '_id'
    var mdb;
    return {
        connect:function (callback) {
            console.log('Attempting to open a connection to mongodb...');

            var servers = new Array();
            for (var i = 0; i < mongodbConfig.replicaSet.length; i++) {
                var inst = mongodbConfig.replicaSet[i]
                servers.push(new mongodb.Server(inst.host, inst.port, {}))
            }

            var replStat;
            if(servers.length>1){
                replStat= new mongodb.ReplSetServers(servers);
            }
            else{
                replStat = servers[0]
            }
            var mdb = new mongodb.Db(mongodbConfig.dbName, replStat, {w:1});

            mdb.open(function (err, db) {
                if (err) {callback(err); return;};
                if (mongodbConfig.username && mongodbConfig.password) {
                    mdb.authenticate(mongodbConfig.username, mongodbConfig.password, function (err, authorized) {
                        if (err) {callback(err); return;};
                        if (!authorized) {callback('The mongoConfig username and password did not authorize against the mongodb database.'); return;};

                        callback(null,db)
                    });
                }
                else {
                    callback(null,db)
                }
            });

        },
        setDb:function (db) {
            mdb = db;
        },
        getDb:function(){
            return mdb
        },
        ObjectID:function(id){
          return new mongodb.ObjectID(id)
        },
        dataUpdate:function (model, queryJson, data, callback) {
            data = _dbutils.fieldReduce(model.fields, data)
            callback = callback || function (err) {
            }
            mdb.collection(model.name, function (err, collection) {
                if (err) {
                    callback(err)
                    return;
                }
                collection.findAndModify(queryJson, [
                    ['_id', 'asc']
                ], {$set:data}, {safe:true},
                    function (err, obj) {
                        if(obj){
                            if(_.isArray(obj) && obj.length == 1){
                                obj = obj[0]
                            }
                        }
                        callback(err, obj)
                    });
            });
        },
        dataCreate:function (model, data, callback) {
            data = _.isArray(data)?data:data
            for(var i=0;i<data.length;i++){
                data[i] = _dbutils.fieldReduce(model.fields, data[i])
            }
            callback = callback || function (err) {
            }
            mdb.collection(model.name, function (err, collection) {
                if (err) {
                    callback(err)
                    return;
                }
                collection.insert(data, {safe:true},
                    function (err, obj) {
                        if(obj){
                            if(_.isArray(obj) && obj.length == 1){
                                obj = obj[0]
                            }
                        }
                        callback(err, obj);
                    });
            });
        },
        // just takes the mongodb query instead of the fancy filters.
        dataReadNative:function (model, mongoQuery, mongoOptions, callback) {
            callback = callback || function (err) {
            }
            console.log(mongoQuery)
            _dbutils.getRowcount(model.name, mongoQuery, function (err, totalCount) {
                if (err) {
                    callback(err)
                    return;
                }

                mdb.collection(model.name, function (err, collection) {
                    if (err) {
                        callback(err)
                        return;
                    }
                    collection.find(mongoQuery, mongoOptions, function (err, cursor) {
                        cursor.toArray(function (err, docs) {
                            var result = {};
                            result[totalVariable] = totalCount;
                            result[rowsVariable] = docs;
                            callback(err, result);
                        });
                    });
                });
            });
        },
        dataRead:function (model, queryJson, options, callback) {
            callback = callback || function (err) {
            }
            // joins the queryJson with additional options filters if they exist
            var mongoQuery = _dbutils.toMongoFilters(queryJson, options, model)
            var mongoOptions = _dbutils.toMongoOptions(options)
            _dbutils.dataReadNative(model, mongoQuery, mongoOptions, callback)
        },
        dataDelete:function (model, queryJson, options, callback) {
            callback = callback || function (err) {
            }
            var mongoFilters = _dbutils.toMongoFilters(queryJson,options, model)
            mdb.collection(model.name, function (err, collection) {
                if (err) {
                    callback(err)
                    return;
                }
                collection.remove(mongoFilters, function (err, result) {
                    callback(err, result);
                });
            });
        },
        createIndex:function (model, fieldOrSpec, options, callback) {
            callback = callback || function (err) {
            }
            mdb.collection(model.name, function (err, collection) {
                if (err) {
                    callback(err)
                    return;
                }
                collection.createIndex(fieldOrSpec,options, function (err) {
                    callback(err);
                });
            });
        },
        getRowcount:function (modelName, query, callback) {
            callback = callback || function (err) {
                console.log(err);
            };
            if(_.isObject(query) && _.isEmpty(query)){query = false}

            if (query) {
                mdb.collection(modelName, function (err, collection) {
                    collection.count(query, function (err, count) {
                        callback(err, count);
                    });
                });
            }
            else {
                mdb.collection(modelName, function (err, collection) {
                    collection.count(function (err, count) {
                        callback(err, count);
                    });
                });
            }
        },
        toMongoOptions:function (options) {
            var start = options.start || 0;
            var limit = options.limit || 200;
            if (options.sort && _.isString(options.sort)) {
                options.sort = JSON.parse(options.sort)
            }
            var sortField = (options.sort && options.sort.length > 0 && options.sort[0].property ? options.sort[0].property : idProperty);
            var sortDir = options.sort && options.sort.length > 0 && options.sort[0].direction ? options.sort[0].direction : 'ASC';
            sortDir = sortDir.toLowerCase();
            sortDir = (sortDir == 'asc' ? 1 : -1);
            var sort = {};
            sort[sortField] = sortDir;
            return {'sort':sort, 'skip':start, 'limit':limit}
        },
        buildFieldFilter:function (field, comparator, value) {
            var mongoFilter = {};
            if (comparator == '>') {
                mongoFilter[field] = {$gt:parseInt(value)};
            }
            else if (comparator == '<') {
                mongoFilter[field] = {$lt:parseInt(value)};
            }
            else if (comparator == '<=') {
                mongoFilter[field] = {$lte:parseInt(value)};
            }
            else if (comparator == '>=') {
                mongoFilter[field] = {$gte:parseInt(value)};
            }
            else if (comparator == '!=') {
                mongoFilter[field] = {$ne:(isNaN(value) ? value : parseInt(value))};
            }
            else if (comparator == 'RE') {
                mongoFilter[field] = { $regex:value, $options:'i' };
            }
            else if (comparator == 'NI') {
                mongoFilter[field] = { $nin:value, $options:'i' };
            }
            else if (comparator == 'IN') {
                mongoFilter[field] = { $in:(_.isArray(value)?value:[value]), $options:'i' };
            }
            else {
                mongoFilter[field] = value;
            }
            return mongoFilter;
        },
        toMongoFilters:function (queryJson, options, model) {
            var filters = options.filters ? (_.isString(options.filters)?JSON.parse(options.filters):options.filters) : [];
            var mongoFilters = [];
            var field, val;
            for (var i = 0; i < filters.length; i++) {
                var filter = filters[i];
                if (filter.field && filter.hasOwnProperty('value')) {
                    field = model.fields[filter.field];
                    // if its a number field and not a number, then skip
                    if (field && field.type == 'number' && isNaN(filter.value)) continue;
                    mongoFilters.push(_dbutils.buildFieldFilter(filter.field, filter.comparator, !isNaN(filter.value) && field.type == 'number' ? parseInt(filter.value) : filter.value));
                }
                else if (filter.value) {
                    var fullTextFilter = [];
                    // if no field is specified, then we will do a rudimentary hack to supply full text search by
                    // doing a or on all fields with the comparator supplied
                    for (var x in model.fields) {
                        if (x == model.idProperty || x == '_id') continue;
                        field = model.fields[x];
                        // if its a number field and not a number, then skip
                        if (field.type == 'number' && isNaN(filter.value)) continue;
                        fullTextFilter.push(_dbutils.buildFieldFilter(x, filter.comparator, !isNaN(filter.value) && field.type == 'number' ? parseInt(filter.value) : filter.value));
                    }
                    if(fullTextFilter.length > 0){
                    mongoFilters.push({$or:fullTextFilter});
                    }
                }
            }
            // add in any filters from the queryJson
            if(queryJson){
                if(_.isString(queryJson)){
                    queryJson = JSON.parse(queryJson)
                }
                if(_.isArray(queryJson) && queryJson.length>0){
                    mongoFilters = mongoFilters.concat(queryJson)
                }
                else if(_.isObject(queryJson) && !_.isEmpty(queryJson)){
                    mongoFilters.push(queryJson)
                }
            }

            if (_.isArray(mongoFilters)) {
                if (mongoFilters.length == 0) {
                    mongoFilters = {};
                }
                else if (mongoFilters.length == 1) {
                    mongoFilters = mongoFilters[0];
                }
                else {
                    if(options.or=='true'){
                        mongoFilters = { $or:mongoFilters};
                    }
                    else{
                        mongoFilters = { $and:mongoFilters};
                    }
                }
            }
            return mongoFilters;
        },
        // takes meta fields and a data object.  deletes all fields from data object if the field is not in meta
        fieldReduce:function (metaFields, data) {
            var d = _.clone(data)
            for (var k in d) {
                if (!metaFields[k]) {
                    delete d[k]
                }
            }
            return d
        }

    };
}();

exports.dbUtils = _dbutils;