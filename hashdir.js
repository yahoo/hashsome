// given a directory path, and a file matching patterns, calculate a checksum
// for all matched files

var fs = require('fs'),
    crypto = require('crypto'),
    Scanfs = require('scanfs'),
    hashfile = require('./hashfile');


function match(str) {
    return function(re) { return str.match(re); };
}

function metahash(algo, checksums) {
    var hash = crypto.createHash(algo);
    
    // hash all the hashes
    checksums.forEach(function (sum) {
        hash.update(sum);
    });

    // if there were no checksums, return 0 instead of the hash of nothing. For
    // example, the md5 of nothing hashes to 'd41d8cd98f00b204e9800998ecf8427e'.
    return checksums.length && hash.digest('hex');
}

function hashdir(dir, opts, cb) {
    var scan = new Scanfs(opts.ignore),
        results = {
            dir: dir,
            checksum: null,
            checksums: {},
            invalid: {}
        },
        count = 1; // track pending async operations; is 0 when scan (after the
                   // 'done' event) and any hashfile operations are done.

    function isDone() {
        if (!--count) {
            results.checksum = metahash(opts.algo, Object.keys(results.checksums));
            cb(null, results);
        }
    }

    function afterHash(err, pathname, hash) {
        if (err) {
            onErr(err);
        } else {
            results.checksums[hash] = pathname;
        }
        isDone();
    }

    function onErr(err) {
        results.invalid[err.path] = err.code;
    }

    function onFile(err, pathname) {
        if (opts.select.some(match(pathname))) {
            count++;
            hashfile(pathname, opts.algo, afterHash);
        }
    }

    scan.on('file', onFile);
    scan.on('error', onErr);
    scan.on('done', isDone);
    scan.relatively(dir);
}

function main(dir, options, callback) {
    var defaults = {
            algo: 'md5',
            select: [/-min\.(css|js)$/, /\.(gif|jpe?g|png|swf)$/, /\/lang\/.+\.js$/],
            ignore: []
        };

    if (!callback) {
        callback = options;
        options = {};
    }

    Object.keys(defaults).forEach(function (key) {
        if (!options.hasOwnProperty(key)) {
            options[key] = defaults[key];
        }
    });

    hashdir(dir, options, callback);
}

module.exports = main;