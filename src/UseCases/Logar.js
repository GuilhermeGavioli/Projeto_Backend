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
const logar_1 = __importDefault(require("../DTO/output/logar"));
const PayloadDTO_1 = __importDefault(require("../DTO/input/PayloadDTO"));
class Logar {
    constructor(repository, cryptography, authentication) {
        this.repository = repository;
        this.cryptography = cryptography;
        this.authentication = authentication;
    }
    execute(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield this.repository.findUserByEmail(inputData.email);
            if (!userFound)
                return new logar_1.default("Usuario nao encontrado", 404, true);
            const passwordsMatch = yield this.cryptography.compare(userFound.user_password);
            if (!passwordsMatch)
                return new logar_1.default("Senhas nao correspondem", 404, true);
            const payload = new PayloadDTO_1.default(userFound.userid, userFound.full_name, userFound.email, userFound.user_image);
            const payloadObject = yield payload.getPayloadObject();
            const token = yield this.authentication.generateToken(payloadObject);
            return new logar_1.default("logado", 200, false, token);
        });
    }
}
exports.default = Logar;
