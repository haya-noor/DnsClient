"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportMethod = void 0;
var dgram = require("dgram");
var TransportMethod = /** @class */ (function () {
    function TransportMethod(serverAddress, port) {
        var _this = this;
        this.serverAddress = serverAddress;
        this.port = port;
        this.socket = dgram.createSocket('udp4');
        this.socket.on('error', function (err) {
            console.error("Socket error:\n".concat(err.stack));
            _this.socket.close();
        });
    }
    TransportMethod.prototype.sendPacket = function (packet) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.socket.send(packet, 0, packet.length, _this.port, _this.serverAddress, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                _this.socket.on('message', function (message) {
                    resolve(message);
                });
                // Set a timeout in case no response is received
                setTimeout(function () {
                    reject(new Error('Request timed out'));
                }, 5000);
            });
        });
    };
    TransportMethod.prototype.close = function () {
        this.socket.close();
    };
    return TransportMethod;
}());
exports.TransportMethod = TransportMethod;
