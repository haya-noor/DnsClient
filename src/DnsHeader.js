"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsHeader = void 0;
var DnsHeader = /** @class */ (function () {
    function DnsHeader() {
        this.id = Math.floor(Math.random() * 65535);
        this.flags = 0x0100;
        this.qdcount = 1; // Initialize qdcount to 1
        this.ancount = 0;
        this.nscount = 0;
        this.arcount = 0;
    }
    DnsHeader.prototype.writeToBuffer = function (buffer, offset) {
        buffer.writeUInt16BE(this.id, offset);
        buffer.writeUInt16BE(this.flags, offset + 2);
        buffer.writeUInt16BE(this.qdcount, offset + 4);
        buffer.writeUInt16BE(this.ancount, offset + 6);
        buffer.writeUInt16BE(this.nscount, offset + 8);
        buffer.writeUInt16BE(this.arcount, offset + 10);
    };
    // Update qdcount based on the number of questions
    DnsHeader.prototype.updateQuestionCount = function (count) {
        this.qdcount = count;
    };
    DnsHeader.prototype.getSize = function () {
        return 12; // Size of the header in bytes
    };
    // Public setters for private properties
    DnsHeader.prototype.setId = function (id) {
        this.id = id;
    };
    DnsHeader.prototype.setFlags = function (flags) {
        this.flags = flags;
    };
    DnsHeader.prototype.setQdcount = function (qdcount) {
        this.qdcount = qdcount;
    };
    DnsHeader.prototype.setAncount = function (ancount) {
        this.ancount = ancount;
    };
    DnsHeader.prototype.setNscount = function (nscount) {
        this.nscount = nscount;
    };
    DnsHeader.prototype.setArcount = function (arcount) {
        this.arcount = arcount;
    };
    // Public getters for private properties
    DnsHeader.prototype.getQdcount = function () {
        return this.qdcount;
    };
    DnsHeader.prototype.getAncount = function () {
        return this.ancount;
    };
    DnsHeader.prototype.getNscount = function () {
        return this.nscount;
    };
    DnsHeader.prototype.getArcount = function () {
        return this.arcount;
    };
    return DnsHeader;
}());
exports.DnsHeader = DnsHeader;
