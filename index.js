//  Firefox Extension Packer
//  Copyright 2015 AVAST Software s.r.o.
//  http://www.avast.com
//
//  Wrapper around Firefox Add-on SDK

(function () {
    'use strict';

    var execute = require('child_process').exec;
    var when = require('when');
    var path = require('path');

    // promisified child_process.exec
    function exec(command, options) {
        var hide_stdout = false;

        if (!options) {
            options = { };
        }
        if (!options.cwd) {
            options.cwd = __dirname;
        }
        if (options.hide_stdout) {
            hide_stdout = true;
            delete options['hide_stdout'];
        }

        //console.log(command);
        return when.promise(function (resolve, reject) {
            execute(command, options, function (err, stdout, stderr) {
                if (!hide_stdout && stdout) {
                    console.log(stdout);
                }
                if (stderr) {
                    console.log(stderr);
                }
                if (err) {
                    reject(err.code);
                }
                else {
                    resolve(stdout);
                }
            })
        });
    }

    // pack Firefox extension
    //
    // @param xpiName name of the pcaked extension
    // @param addonDir source directory
    // @param options {
    //          sdkPath path to Firefox Add-on SDK
    // }
    // @return promise
    // 
    function pack(xpiName, addonDir, options) {
        if (process.env['SHELL']) {
            // some Linux shell
            return exec('bash -c "pushd ' + options.sdkPath + ' && . ' + path.join('bin', 'activate') + ' && popd' + ' && ' + path.join(options.sdkPath, 'bin', 'cfx') + ' xpi --pkgdir=' + addonDir + ' --output-file=' + xpiName + '"');
        }
        else {
            // activate.bat in the SDK is rather buggy
            return exec('pushd ' + options.sdkPath + ' && ' + path.join('bin', 'activate') + ' && popd' + ' && ' + path.join(options.sdkPath, 'bin', 'cfx') + ' xpi --pkgdir=' + addonDir + ' --output-file=' + xpiName);
        }
    }

    module.exports = pack;

})();
