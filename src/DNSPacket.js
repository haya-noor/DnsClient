"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNSPacket = void 0;
var DnsHeader_1 = require("./DnsHeader");
var DnsQuestion_1 = require("./DnsQuestion");
var DNSPacket = /** @class */ (function () {
    function DNSPacket(domains) {
        this.header = new DnsHeader_1.DnsHeader();
        this.questions = domains.map(function (domain) { return new DnsQuestion_1.DnsQuestion(domain); });
        this.header.updateQuestionCount(this.questions.length);
    }
    DNSPacket.prototype.getBuffer = function () {
        var buffer = Buffer.alloc(512); // Allocate enough space for the DNS packet
        var offset = 0;
        this.header.writeToBuffer(buffer, offset);
        offset += this.header.getSize();
        for (var _i = 0, _a = this.questions; _i < _a.length; _i++) {
            var question = _a[_i];
            question.writeToBuffer(buffer, offset);
            offset += question.getSize();
        }
        return buffer.slice(0, offset);
    };
    return DNSPacket;
}());
exports.DNSPacket = DNSPacket;
