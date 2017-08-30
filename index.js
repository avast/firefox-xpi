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

    // pack Firefox extension
    //
    // @param xpiName name of the pcaked extension
    // @param addonDir source directory
    // @return promise
    // 
    function pack(xpiName, addonDir, options) {
        try {
            var webExtManifest = path.join(addonDir, 'manifest.json');
            fs.accessSync(webExtManifest);
            try {
                return packWebExt(xpiName, addonDir, options);
            }
            catch (ex) {
                return Promise.reject(ex);
            }
        }
        catch (ex) {
            return packAddon(path.resolve(xpiName), path.resolve(addonDir));
        }
    }

    function packAddon(xpiName, addonDir) {
        var xpi = require('jpm/lib/xpi');
        var manifest = require(path.join(addonDir, 'package.json'));
        console.log("xpi ", addonDir, " ", path.dirname(xpiName), " ", path.basename(xpiName));
        return xpi(manifest, { addonDir: addonDir, xpiPath: path.dirname(xpiName), xpiName: path.basename(xpiName) })  // , verbose: true
            .then(function (fullPath) {
                fs.renameSync(fullPath, xpiName);
                return 0;
            });
    }

    function packWebExt(zipName, addonDir, options) {
        var myArgv = process.argv.slice();
        var webExtModulePath = path.resolve(require.resolve('web-ext/dist/web-ext.js'), '../..');
        var intermediateDir = options && options.tmpDir ? path.resolve(options.tmpDir, 'web-ext-artifacts') : path.resolve(path.dirname(zipName), 'web-ext-artifacts');

        process.argv = [ process.argv[0], path.resolve(webExtModulePath, 'bin/web-ext'), 'build', '--overwrite-dest', '--artifacts-dir=' +  intermediateDir, "--source-dir=" + addonDir];

        var rm = require('del').sync;
        rm(intermediateDir, {force: true});
        
        var webExt = require('web-ext/dist/web-ext.js').main;
        return webExt(webExtModulePath)
            .then(function () {
                var result = fs.readdirSync(intermediateDir)[0];
                fs.renameSync(path.resolve(intermediateDir, result), zipName);
                rm(intermediateDir, {force: true});
                console.log("WebExtension at " + zipName);
                return 0;
            })
            .catch(function (ex) {
                console.log(ex);
                return 1;
            });
    }

    module.exports = pack;

})();
