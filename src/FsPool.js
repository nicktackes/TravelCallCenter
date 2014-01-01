var events = require('events')
var fs = require('fs');
var util = require('util')
var path = require('path')
// file server pool
var FsPool = module.exports = function (dir) {
    events.EventEmitter.call(this)
    this.dir = dir;
    this.files = [];
    this.active = [];
    this.threads = 1;
    this.on('run', this.runQuta.bind(this))
};
// So will act like an event emitter
util.inherits(FsPool, events.EventEmitter);

FsPool.prototype.runQuta = function () {
//    if (this.files.length === 0 && this.active.length === 0) {
//        return this.emit('done');
//    }
    if (this.active.length < this.threads) {
        var name = this.files.shift()

        this.active.push(name)
        var fileName = path.join(this.dir, name);
        var self = this;
        fs.stat(fileName, function (err, stats) {
            if (err)
                throw err;
            if (stats.isFile()) {
                fs.readFile(fileName, function (err, data) {
                    if (err)
                        throw err;
                    self.active.splice(self.active.indexOf(name), 1)
                    self.emit('file', name, data,self.files.length === 0 && self.active.length === 0);
                    if (self.files.length === 0 && self.active.length === 0) {
                        return self.emit('done');
                    }
                    else{
                        self.emit('run');
                    }
                });
            } else {
                self.active.splice(self.active.indexOf(name), 1)
                self.emit('dir', name);
                self.emit('run');
            }
        });
    }
    return this
};
FsPool.prototype.init = function () {
    var dir = this.dir;
    var self = this;
    fs.readdir(dir, function (err, files) {
        if (err)
            throw err;
        self.files = files
        self.emit('run');
    })
    return this
};
