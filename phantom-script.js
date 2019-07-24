/* jshint node: true */
'use strict';

var system = require('system'),
    page = require('webpage').create();

var args = [
    'in',
    'out',
    'cssPath',
    'paperFormat',
    'paperOrientation',
    'paperBorder',
    'renderDelay',
].reduce(function(args, name, i) {
    args[name] = system.args[i+1];
    return args;
}, {});

function pageOpenHandler(status) {
    if (status == "fail") {
        page.close();
        phantom.exit(1);
        return;
    }

    page.evaluate(function(cssPath) {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = cssPath;
        document.querySelector('head').appendChild(css);
    }, args.cssPath);

    page.paperSize = {
        format: args.paperFormat,
        orientation: args.paperOrientation,
        border: args.paperBorder
    };

    page.render(args.out);
    page.close();
    phantom.exit(0);
}

// (page.open is equivalent to page.onLoadFinished)
if(args.in.toString().indexOf("C:") >-1 || args.in.toString().indexOf("D:") >-1) {
    page.open("file:///"+args.in,pageOpenHandler);
} else {
    page.open(args.in,pageOpenHandler);
}
