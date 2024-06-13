"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseAndDecode = void 0;
var DnsHeader_1 = require("./DnsHeader");
var DnsQuestion_1 = require("./DnsQuestion");
var DnsAnswer_1 = require("./DnsAnswer");
var ParseAndDecode = /** @class */ (function () {
    function ParseAndDecode(buffer) {
        this.buffer = buffer;
        this.header = new DnsHeader_1.DnsHeader();
        this.questions = [];
        this.answers = [];
        this.parse();
    }
    ParseAndDecode.prototype.parse = function () {
        var offset = 0;
        this.header = this.parseHeader(offset);
        offset += this.header.getSize();
        for (var i = 0; i < this.header.getQdcount(); i++) {
            var question = this.parseQuestion(offset);
            this.questions.push(question);
            offset += question.getSize();
        }
        for (var i = 0; i < this.header.getAncount(); i++) {
            var answer = new DnsAnswer_1.DnsAnswer();
            answer.parse(this.buffer, offset);
            this.answers.push(answer);
            offset += answer.getSize();
        }
    };
    ParseAndDecode.prototype.parseHeader = function (offset) {
        var header = new DnsHeader_1.DnsHeader();
        header.setId(this.buffer.readUInt16BE(offset));
        header.setFlags(this.buffer.readUInt16BE(offset + 2));
        header.setQdcount(this.buffer.readUInt16BE(offset + 4));
        header.setAncount(this.buffer.readUInt16BE(offset + 6));
        header.setNscount(this.buffer.readUInt16BE(offset + 8));
        header.setArcount(this.buffer.readUInt16BE(offset + 10));
        return header;
    };
    ParseAndDecode.prototype.parseQuestion = function (offset) {
        var end = offset;
        while (this.buffer[end] !== 0)
            end++;
        var domain = this.buffer.toString('ascii', offset, end);
        return new DnsQuestion_1.DnsQuestion(domain);
    };
    ParseAndDecode.prototype.getHeader = function () {
        return this.header;
    };
    ParseAndDecode.prototype.getQuestions = function () {
        return this.questions;
    };
    ParseAndDecode.prototype.getAnswers = function () {
        return this.answers;
    };
    return ParseAndDecode;
}());
exports.ParseAndDecode = ParseAndDecode;
