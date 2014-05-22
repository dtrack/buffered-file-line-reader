var BufferedFileLineReaderSync = require('../buffered-file-line-reader-sync');
var path = require('path');
var sinon = require('sinon');
var fs = require('fs');


var runTestAssertions = function (
        test, fileName, bufferSize, expectedNumberOfLines,
        expectedNumberOfEmptyLines) {
    test.expect(expectedNumberOfLines + 5);
    // add spy to fs
    var mySpy = sinon.spy(fs, 'readSync');

    var testFile = path.join(__dirname, fileName);
    // 8 byte buffer
    var rd = new BufferedFileLineReaderSync(
        testFile, {
            bufferSize: bufferSize,
        });

    var totalEmptyLines = 0;
    var lines = [];

    var line;
    var hasNext;
    while (lines.length < expectedNumberOfLines) {
        hasNext = rd.hasNextLine();
        test.ok(
            hasNext,
            'there is still a next line after the ' + lines.length + 'th'
        );
        line = rd.nextLine();
        lines.push(line);
        if (line === '') {
            totalEmptyLines ++;
        }
        if (!hasNext) {
            ok(false, 'did not get expected number of lines');
            test.done();
        }
    }
    test.ok(!rd.hasNextLine(), 'there should be no more line');
    test.equal(
        rd.nextLine(), null, 'nextLine returns null when no more lines');
    test.equal(
        expectedNumberOfLines,
        lines.length, 'Found ' + expectedNumberOfLines + ' lines.');

    test.equal(
        expectedNumberOfEmptyLines,
        totalEmptyLines, 'Found ' + totalEmptyLines + ' empty lines.');

    // finally verify that the expected number of buffer refilled happenned
    var fileSize = fs.statSync(testFile).size;

    var expectedBufferRefills = Math.floor(fileSize / bufferSize) + 1;

    test.equal(
        mySpy.callCount, expectedBufferRefills,
        'Buffer has been refilled ' + expectedBufferRefills + 'times.');

    fs.readSync.restore();
    test.done();

};

module.exports.testFileReaderSmallBufferNewLineEnd = function (test) {
    runTestAssertions(test, 'test-file.txt', 8, 10, 5);
};

module.exports.testFileReaderBigBufferNewLineEnd = function (test) {
    runTestAssertions(test, 'test-file.txt', 8192, 10, 5);
};

module.exports.testFileReaderSmallBufferNoNewLineEnd = function (test) {
    runTestAssertions(test, 'test-file-no-new-line-end.txt', 8, 5, 2);
};

module.exports.testFileReaderBigBufferNoNewLineEnd = function (test) {
    runTestAssertions(test, 'test-file-no-new-line-end.txt', 8192, 5, 2);
};
