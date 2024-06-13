"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsAnswer = void 0;
var DnsAnswer = /** @class */ (function () {
    function DnsAnswer() {
        this.name = '';
        this.type = 0;
        this.class = 0;
        this.ttl = 0;
        this.rdlength = 0;
        this.rdata = '';
    }
    DnsAnswer.prototype.writeToBuffer = function (buffer, offset) {
        // Typically, this method is not needed for DNS answers, but implemented for completeness
        var labels = this.name.split('.');
        labels.forEach(function (label) {
            buffer.writeUInt8(label.length, offset++);
            buffer.write(label, offset, 'ascii');
            offset += label.length;
        });
        buffer.writeUInt8(0, offset++); // Null terminator for the domain name
        buffer.writeUInt16BE(this.type, offset);
        offset += 2;
        buffer.writeUInt16BE(this.class, offset);
        offset += 2;
        buffer.writeUInt32BE(this.ttl, offset);
        offset += 4;
        buffer.writeUInt16BE(this.rdlength, offset);
        offset += 2;
        buffer.write(this.rdata, offset, 'ascii'); // Assuming rdata is a string, adjust as necessary
    };
    DnsAnswer.prototype.getSize = function () {
        return this.name.split('.').reduce(function (prev, label) { return prev + label.length + 1; }, 1) + 10 + this.rdata.length;
    };
    DnsAnswer.prototype.parse = function (buffer, offset) {
        var end = offset;
        while (buffer[end] !== 0)
            end++;
        this.name = buffer.toString('ascii', offset, end);
        offset = end + 1;
        this.type = buffer.readUInt16BE(offset);
        offset += 2;
        this.class = buffer.readUInt16BE(offset);
        offset += 2;
        this.ttl = buffer.readUInt32BE(offset);
        offset += 4;
        this.rdlength = buffer.readUInt16BE(offset);
        offset += 2;
        this.rdata = buffer.toString('ascii', offset, offset + this.rdlength); // Adjust parsing logic as needed
    };
    DnsAnswer.prototype.getName = function () {
        return this.name;
    };
    DnsAnswer.prototype.getType = function () {
        return this.type;
    };
    DnsAnswer.prototype.getClass = function () {
        return this.class;
    };
    DnsAnswer.prototype.getTTL = function () {
        return this.ttl;
    };
    DnsAnswer.prototype.getRdlength = function () {
        return this.rdlength;
    };
    DnsAnswer.prototype.getRdata = function () {
        return this.rdata;
    };
    return DnsAnswer;
}());
exports.DnsAnswer = DnsAnswer;
