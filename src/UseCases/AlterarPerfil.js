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
const cadastrar_1 = __importDefault(require("../DTO/output/cadastrar"));
const Produtor_1 = __importDefault(require("../Entity/Produtor"));
class AlterarPerfil {
    constructor(repository, cryptography) {
        this.repository = repository;
        this.cryptography = cryptography;
    }
    execute(token, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.repository.findUserByEmail(token.email);
            if (!foundUser)
                return new cadastrar_1.default("Erro inesperado. usuario nao exite. Tente novamente", 400, true);
            if (token.email !== foundUser.email)
                return new cadastrar_1.default("Permission denied. Can't alter other user information. emails don't match", 400, true);
            if (token.user_id !== foundUser.userid)
                return new cadastrar_1.default("Permission denied. Can't alter other user information. ids don't match", 400, true);
            const hashedPassword = yield this.cryptography.hash();
            const produtorAtualizado = new Produtor_1.default(foundUser.userid, inputData.name, token.email, hashedPassword, inputData.gender, inputData.city, inputData.birthDate, inputData.aboutMe, inputData.bio, inputData === null || inputData === void 0 ? void 0 : inputData.image);
            if (inputData.password.trim() == "")
                produtorAtualizado.password = foundUser.user_password;
            try {
                yield this.repository.updateOneUser(token.email, produtorAtualizado);
                return new cadastrar_1.default("Alterado com sucesso", 200, false);
            }
            catch (err) {
                console.log(err);
                return new cadastrar_1.default("Algo inesperado aconteceu. Tente novamente", 403, true);
            }
        });
    }
}
exports.default = AlterarPerfil;
