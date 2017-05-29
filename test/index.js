/* jshint node: true */
'use strict';

var pugpdf = require('../'),
   assert = require('assert'),
   fs = require('fs'),
   tmp = require('tmp'),
   through = require('through'),
   should = require('should');

tmp.setGracefulCleanup();

function helper(path, done) {
  tmp.file({
      postfix: '.pdf',
      template: '/tmp' + path + '.XXXXXX.pdf',
      keep: true,
      discardDescriptor: true
  }, function(err, tmpPdfPath, tmpPdfFd) {
    should.not.exist(err);
    //fs.close(tmpPdfFd);

    var outputStream = fs.createWriteStream(tmpPdfPath);

    fs.createReadStream(__dirname+path).pipe(pugpdf()).pipe(outputStream);

    outputStream.on('finish', function() {
      fs.readFile(tmpPdfPath, {encoding: 'utf8'}, function (err, data) { 
        should.not.exist(err);
        data.length.should.be.above(0);
        done();
      });
    });
  });
}

describe('simple pug file without locals to pdf', function() {
  it('should generate a non-empty PDF', function(done) {
    this.timeout(5000);
    helper('/simple.pug', done);
  });
});

describe('complex pug file without locals to pdf', function() {
  it('should generate a non-empty PDF', function(done) {
    this.timeout(5000);
    helper('/complex.pug', done);
  });
});
