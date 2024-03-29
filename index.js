// index.js of module pug-pdf

'use strict';

var fs = require('fs'),
    path = require('path'),
    through2 = require('through2'),
    pug = require('pug'),
    tmp = require('tmp'),
    childProcess = require('child_process'),
    duplexer = require('duplexer');

tmp.setGracefulCleanup();

function pugpdf (options) {
    options = options || {};
    options.phantomPath = options.phantomPath || require('phantomjs-prebuilt').path;
    options.cssPath = options.cssPath || __dirname + '/../pdf.css';
    options.paperFormat = options.paperFormat || 'A4';
    options.paperOrientation = options.paperOrientation || 'portrait';
    options.paperBorder = options.paperBorder || '1cm';
    options.locals = options.locals || {};

    var pugStr = '';
    var pugToHtml = through2(
        function write (chunk, enc, cb) {
            pugStr += chunk.toString(); // accumulate whole pug template
            cb();
        },
        function end (cb) {
            // Catch rendering errors so that we always return some HTML
            try {
                const html = pug.render(pugStr, options.locals);
                this.push(html);
            } catch (err) {
                const error_html = `<!DOCTYPE html><html><body><h1>Error rendering Pug template</h1><pre>${err.message}</pre></body></html>`;
                this.push(error_html);
            }
            cb();
        }
    );

    const inputStream = through2(),
        outputStream = through2();

    inputStream.pause(); // until we are ready to read

    tmp.file({postfix: '.html'}, function(err, tmpHtmlPath, tmpHtmlFd) {
        if (err) {
            return outputStream.emit('error', err);
        }
        fs.close(tmpHtmlFd, function(){});

        tmp.file({postfix: '.pdf'}, function(err, tmpPdfPath, tmpPdfFd) {
            if (err) {
                return outputStream.emit('error', err);
            }
            fs.close(tmpPdfFd, function(){});

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
