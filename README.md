Synchroneous, Buffered, Line by Line File Reader
=================================================

Simple library to read a file line by line, without loading the full file
in memory. Ideal to read massive files.

# Usage:

'''js
var BufferedFileLineReaderSync = require('buffered-file-line-reader-sync');

var line;
var filename = 'path/to/big/file';

var options = {
    encoding: 'utf8',
    bufferSize: 8192
}

bufferedReader = new BufferedFileLineReaderSync(filename, options);

while (bufferedReader.hasNextLine()) {
    console.log(bufferedReader.nextLine());
}
'''

# API:
** Class: BufferedFileLineReaderSync(path [, options]) **
- `path`: path to the file to read
- `options`: object with the following parameters:
    - string `encoding` (defaults to `'utf8'`: any encoding supported by
    `Buffer.toString` method of the `Buffer` node base class.
    - int `bufferSize` (defaults to 8192): size in octets (bytes) of the
    underlying buffer used.