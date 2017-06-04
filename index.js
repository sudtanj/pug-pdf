// index.js of module pug-pdf

'use strict';

var fs = require('fs'),
    path = require('path'),
    through = require('through'),
    pug = require('pug'),
    tmp = require('tmp'),
    childProcess = require('child_process'),
    duplexer = require('duplexer');

tmp.setGracefulCleanup();

function pugpdf(options) {
    options = options || {};
    options.phantomPath = options.phantomPath || require('phantomjs-prebuilt').path;
    options.cssPath = options.cssPath || __dirname + '/../pdf.css';
    options.paperFormat = options.paperFormat || 'A4';
    options.paperOrientation = options.paperOrientation || 'portrait';
    options.paperBorder = options.paperBorder || '1cm';
    options.locals = options.locals || {};

    var pugStr = '';
    var pugToHtml = through(
        function write(data) {
            pugStr += data; // accumulate whole pug template
        },
        function end() {
            var fn = pug.compile(pugStr);
            var html = fn(options.locals);
            this.queue(html);
            this.queue(null);
        }
    );
    pugToHtml.on('error', (err) => {
        console.log('=== pugToHtml error: ', err);
    });

    const inputStream = through(),
        outputStream = through();

    inputStream.pause(); // until we are ready to read

    tmp.file({postfix: '.html'}, function(err, tmpHtmlPath, tmpHtmlFd) {
        if (err) {
            return outputStream.emit('error', err);
        }
        fs.close(tmpHtmlFd);

        tmp.file({postfix: '.pdf'}, function(err, tmpPdfPath, tmpPdfFd) {
            if (err) {
                return outputStream.emit('error', err);
            }
            fs.close(tmpPdfFd);

            var htmlToTmpHtmlFile = fs.createWriteStream(tmpHtmlPath);
            htmlToTmpHtmlFile.on('finish', function() {
                var args = [
                    path.join(__dirname, 'phantom-script.js'),
                    tmpHtmlPath,
                    tmpPdfPath,
                    options.cssPath,
                    options.paperFormat,
                    options.paperOrientation,
                    options.paperBorder,
                ];

                childProcess.execFile(options.phantomPath, args, function(err, stdout, stderr) {
                    if (err) {
                        return outputStream.emit('error', err);
                    }
                    fs.createReadStream(tmpPdfPath).pipe(outputStream);
                });
            });

            inputStream.pipe(pugToHtml).pipe(htmlToTmpHtmlFile);
            inputStream.resume();
        });
    });

    return duplexer(inputStream, outputStream);
}

module.exports = pugpdf;
