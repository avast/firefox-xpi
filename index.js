//  Firefox Extension Packer
//  Copyright 2015 AVAST Software s.r.o.
//  http://www.avast.com
//
//  Wrapper around Firefox Add-on SDK

(function () {
    'use strict';

    var when = require('when');
    var path = require('path');
    var fs = require('fs');
    var xpi = require('jpm/lib/xpi');

    // pack Firefox extension
    //
    // @param xpiName name of the pcaked extension
    // @param addonDir source directory
    // @return promise
    // 
    function pack(xpiName, addonDir, options) {
        var manifest = require(path.join(addonDir, 'package.json'));
        console.log("xpi ", addonDir, " ", path.dirname(xpiName), " ", path.basename(xpiName))
        return xpi(manifest, { addonDir: addonDir, xpiPath: path.dirname(xpiName), xpiName: path.basename(xpiName) })  // , verbose: true
            .then(function (fullPath) {
                fs.renameSync(fullPath, xpiName);
                return 0;
            });
    }

    module.exports = pack;

})();
