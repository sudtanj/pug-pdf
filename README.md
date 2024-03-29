Node module that converts Pug files to PDFs. 

Forked from jade-pdf2 (version 0.0.4), which is itself a fork of jade-pdf-redline.

> https://npmjs.org/package/pug-pdf

## Getting started

    npm install --save pug-pdf

## Usage

```javascript
const pugpdf = require('pug-pdf'),
   fs = require('fs');

fs.createReadStream('path/to/template.pug')
  .pipe(pugpdf())
  .pipe(fs.createWriteStream('path/to/document.pdf'));
```

## Options

Pass an options object (`pugpdf({/* options */})`) to configure the output.

##### options.phantomPath
Type: `String`
Default value: `Path provided by phantomjs module`  
*Path to phantom binary*

##### options.cssPath
Type: `String`
Default value: `../pdf.css`  
*Path to custom CSS file*

##### options.paperFormat
Type: `String`
Default value: `A4`  
*'A3', 'A4', 'A5', 'Legal', 'Letter' or 'Tabloid'*

##### options.paperOrientation
Type: `String`
Default value: `portrait`  
*'portrait' or 'landscape'*

##### options.paperBorder
Type: `String`
Default value: `1cm`  
*Supported dimension units are: 'mm', 'cm', 'in', 'px'*

##### options.locals
Type: `Object`
Default value: `{}`  
*Locals for template*

## CLI interface

### Installation

To use pug-pdf as a standalone program from the terminal run

    $ npm install -g pug-pdf

### Usage

```sh
Usage: pug-pdf [options] <pug-file-path>

Options are all optional:

  -h, --help                             output this usage information
  -V, --version                          output the version number
  -p, --phantom-path [path]              Path to PhantomJS binary
  -s, --css-path [path]                  Path to custom CSS file
  -f, --paper-format [format]            'A3', 'A4', 'A5', 'Legal', 'Letter' or 'Tabloid'
  -r, --paper-orientation [orientation]  'portrait' or 'landscape'
  -b, --paper-border [measurement]       Supported dimension units are: 'mm', 'cm', 'in', 'px'
  -o, --out [path]                       Path of where to save the PDF (defaults 
                                         <pug-file-path> with '.pdf' extension)
```

## Running Tests

The test 'suite' does not require any particular testing framework.

Just run the tests with:

    $ node test/index.js

or

    $ npm run test

## Known Bugs

* Uses temporary files, which rather spoils the whole point of using
  this as a stream transform.
  I haven't managed to get the PhantomJS control script read from
  stdin and write to stdout yet.

## License

The MIT License (MIT)

Copyright (c) 2016 Eason Goodale (c) 2017 Chris Dennis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
