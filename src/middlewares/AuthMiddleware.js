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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectionAgainstNonAuthenticatedUsers = exports.ProtectionAgainstAuthenticatedUsers = void 0;
const cadastrar_1 = __importDefault(require("../DTO/output/cadastrar"));
const Authentication_1 = __importDefault(require("../Services/Authentication"));
function ProtectionAgainstAuthenticatedUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenSent = req.headers['authorization'];
        if (!tokenSent)
            return next();
        const authentication = new Authentication_1.default();
        const userTokenFormated = authentication.validateToken(tokenSent);
        if (!userTokenFormated)
            return next();
        const outputData = new cadastrar_1.default("User is already authenticated", 401, true);
        return res.json(outputData);
    });
}
exports.ProtectionAgainstAuthenticatedUsers = ProtectionAgainstAuthenticatedUsers;
function ProtectionAgainstNonAuthenticatedUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenSent = req.headers['authorization'];
        const outputData = new cadastrar_1.default("Permission denied, please login to use this resource", 403, true);
        if (!tokenSent)
            return res.json(outputData);
        const authentication = new Authentication_1.default();
        const userTokenFormated = authentication.validateToken(tokenSent);
        if (!userTokenFormated)
            return res.json(outputData);
        res.locals.userInfo = userTokenFormated;
        next();
    });
}
exports.ProtectionAgainstNonAuthenticatedUsers = ProtectionAgainstNonAuthenticatedUsers;
