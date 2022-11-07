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
class DeletarProduto {
    constructor(repository) {
        this.repository = repository;
    }
    execute(product_id, token_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundProduct = yield this.repository.findProduct(product_id, token_user_id);
            if (!foundProduct)
                return new cadastrar_1.default("Produto nao encontrado", 403, true);
            yield this.repository.deleteOneProduct(foundProduct.product_id, token_user_id); //if error = este produto pode nao pertencer a voce
            return new cadastrar_1.default("Produto deletado com sucesso", 200, false);
        });
    }
}
exports.default = DeletarProduto;
