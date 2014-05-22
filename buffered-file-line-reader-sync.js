
var fs = require('fs');

var BufferedFileLineReaderSync = function (file, options) {
    options = options || {};
    bufferSize = options.bufferSize || 8192;
    encoding = options.encoding || 'utf8';
    var byteBuffer = new Buffer(bufferSize);
    var input = fs.openSync(file, "r");

    var strBuffer = '';
    var finishedStream = false;

    function fillBuffer() {
        var bytesRead = fs.readSync(input, byteBuffer, 0, bufferSize);
        strBuffer += byteBuffer.toString(encoding, 0, bytesRead);
        if (bytesRead < bufferSize) {
            // free up buffer, also will serve to indicate if we are done
            // streaming
            byteBuffer = null;
        }
    }
    fillBuffer();

    function nextLine() {
        var newLineIdx = strBuffer.indexOf('\n');
        var line, output;

        if (newLineIdx === -1) {
            if (!byteBuffer) {
                if (strBuffer) {
                    line = strBuffer;
                    strBuffer = '';
                    return line;
                }
                else {
                    return null;
                }
            }
            else {
                fillBuffer();
                return nextLine();
            }
        }

        line = strBuffer.substr(0, newLineIdx);
        strBuffer = strBuffer.substr(newLineIdx + 1);
        return line;
    }

    function hasNextLine() {
        var newLineIdx = strBuffer.indexOf('\n');
        if (newLineIdx === -1) {
            if (!byteBuffer) {
                if (strBuffer) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                fillBuffer();
                return hasNextLine();
            }
        }
        return true;
    }

    this.nextLine = nextLine;
    this.hasNextLine = hasNextLine;
    return this;
};

module.exports = BufferedFileLineReaderSync;
