"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsQuestion = void 0;
var DnsQuestion = /** @class */ (function () {
    function DnsQuestion(domain) {
        this.domain = domain;
    }
    DnsQuestion.prototype.writeToBuffer = function (buffer, offset) {
        var labels = this.domain.split('.');
        for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
            var label = labels_1[_i];
            buffer.writeUInt8(label.length, offset++);
            buffer.write(label, offset, 'ascii');
            offset += label.length;
        }
        buffer.writeUInt8(0, offset++); // Null terminator for the domain name
        buffer.writeUInt16BE(1, offset); // QTYPE (A record)
        offset += 2;
        buffer.writeUInt16BE(1, offset); // QCLASS (IN)
    };
    DnsQuestion.prototype.getSize = function () {
        return this.domain.split('.').reduce(function (prev, label) { return prev + label.length + 1; }, 5);
    };
    DnsQuestion.prototype.getDomain = function () {
        return this.domain;
    };
    return DnsQuestion;
}());
exports.DnsQuestion = DnsQuestion;
