"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Authentication {
    constructor() {
        var _a;
        this.secret = ((_a = process.env.JWT_SECRET) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    }
    generateToken(payloadInfo) {
        var _a;
        const secret = ((_a = process.env.JWT_SECRET) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const token = jsonwebtoken_1.default.sign(payloadInfo, secret, { expiresIn: 3600 });
        return token;
    }
    validateToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secret, (err, decoded) => {
            if (err)
                return false;
            const decoded_data = JSON.parse(JSON.stringify(decoded));
            return decoded_data;
        });
    }
}
exports.default = Authentication;
