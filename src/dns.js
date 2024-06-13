"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var DNSPacket_1 = require("./DNSPacket");
var TransportMethod_1 = require("./TransportMethod");
var ParseAndDecode_1 = require("./ParseAndDecode");
var fs = require("fs");
var readline = require("readline");
// Function to handle CLI input
function handleCLIInput() {
    return __awaiter(this, void 0, void 0, function () {
        var rl;
        return __generator(this, function (_a) {
            rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Enter the domain names (comma separated): ', function (domains) {
                var domainList = domains.split(',').map(function (domain) { return domain.trim(); });
                performDNSQuery(domainList);
                rl.close();
            });
            return [2 /*return*/];
        });
    });
}
// Function to handle file input
function handleFileInput(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, domains;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileContent = fs.readFileSync(filePath, 'utf-8');
                    domains = fileContent.split('\n').map(function (domain) { return domain.trim(); }).filter(function (domain) { return domain.length > 0; });
                    return [4 /*yield*/, performDNSQuery(domains)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Function to perform DNS query
function performDNSQuery(domains) {
    return __awaiter(this, void 0, void 0, function () {
        var transport, promises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new TransportMethod_1.TransportMethod('8.8.8.8', 53);
                    promises = domains.map(function (domain) { return __awaiter(_this, void 0, void 0, function () {
                        var packet, buffer, response, parser, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    packet = new DNSPacket_1.DNSPacket([domain]);
                                    buffer = packet.getBuffer();
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, transport.sendPacket(buffer)];
                                case 2:
                                    response = _a.sent();
                                    parser = new ParseAndDecode_1.ParseAndDecode(response);
                                    console.log("Response for ".concat(domain, ":"));
                                    console.log("Header:", parser.getHeader());
                                    console.log("Questions:", parser.getQuestions().map(function (q) { return q.getDomain(); }));
                                    parser.getAnswers().forEach(function (answer) {
                                        console.log("Name: ".concat(answer.getName()));
                                        console.log("Type: ".concat(answer.getType()));
                                        console.log("Class: ".concat(answer.getClass()));
                                        console.log("TTL: ".concat(answer.getTTL()));
                                        console.log("RDLength: ".concat(answer.getRdlength()));
                                        console.log("RData: ".concat(answer.getRdata()));
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    console.error("Error during DNS query for ".concat(domain, ":"), error_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    transport.close();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    var args = process.argv.slice(2);
    if (args.length > 0) {
        var input = args[0];
        if (fs.existsSync(input)) {
            handleFileInput(input);
        }
        else {
            var domains = input.split(',').map(function (domain) { return domain.trim(); });
            performDNSQuery(domains);
        }
    }
    else {
        handleCLIInput();
    }
}
main();
