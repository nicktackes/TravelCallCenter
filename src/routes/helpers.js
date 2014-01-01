var url = require('url')
var zlib = require('zlib')
var Stream = require('stream')

exports.page=function(model, req, res) {
    var readRequest = url.parse(req.originalUrl, true).query;
    res.writeHead(200, {'content-type':'text/plain'});
    model.getPage({}, readRequest, function (err, result) {
        res.write(JSON.stringify(result));
        res.end();
    });
}

exports.zipit=function(req, res, data){
    zlib.deflate(data, function(err, buffer) {
      if (!err) {
          res.writeHead(200, { 'content-encoding': 'deflate'});
          res.write(buffer.toString('base64'))
          res.end()
      }
        else{
        res.writeHead(200, {'content-type':'text/plain'});
        res.write(err);
        res.end();

      }
    });

//    var strm = new Stream()
//    strm.pipe = function(dest) {
//      dest.write(data)
//        return dest
//    }
//    strm.on('end', function() {
//        var acceptEncoding = req.headers['accept-encoding'];
//        if (!acceptEncoding) {
//          acceptEncoding = '';
//        }
//
//        // Note: this is not a conformant accept-encoding parser.
//        // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
//        if (acceptEncoding.match(/\bdeflate\b/)) {
//          res.writeHead(200, { 'content-encoding': 'deflate'});
//            strm.pipe(zlib.createDeflate()).pipe(res);
//        } else if (acceptEncoding.match(/\bgzip\b/)) {
//          res.writeHead(200, { 'content-encoding': 'gzip'});
//            strm.pipe(zlib.createGzip()).pipe(res);
//        } else {
//          res.writeHead(200, {'content-type':'text/plain'});
//            strm.pipe(res);
//        }
//        res.end()
//    })

//    strm.end = function() {
//        console.log('zipit end fired!')
//        var acceptEncoding = req.headers['accept-encoding'];
//        if (!acceptEncoding) {
//          acceptEncoding = '';
//        }
//
//        // Note: this is not a conformant accept-encoding parser.
//        // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
//        if (acceptEncoding.match(/\bdeflate\b/)) {
//          res.writeHead(200, { 'content-encoding': 'deflate'});
//            strm.pipe(zlib.createDeflate()).pipe(res);
//        } else if (acceptEncoding.match(/\bgzip\b/)) {
//          res.writeHead(200, { 'content-encoding': 'gzip'});
//            strm.pipe(zlib.createGzip()).pipe(res);
//        } else {
//          res.writeHead(200, {'content-type':'text/plain'});
//            strm.pipe(res);
//        }
//        res.end()
//    }

//    strm.emit('end')
}