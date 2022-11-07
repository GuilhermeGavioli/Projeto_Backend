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
const Produto_1 = __importDefault(require("../Entity/Produto"));
const cadastrar_1 = __importDefault(require("../DTO/output/cadastrar"));
class CriarProduto {
    constructor(repository, idGenerator, validation) {
        this.repository = repository;
        this.idGenerator = idGenerator;
        this.validation = validation;
    }
    execute(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = this.idGenerator.generate();
            const isValid = this.validation.validate();
            if (isValid.error)
                return new cadastrar_1.default(isValid.message, isValid.status, isValid.error);
            const isOrganic = inputData.p_isOrganic.toString().toLowerCase() == 'true' ? 1 : 0;
            const tags = JSON.parse(inputData.p_tags);
            console.log(tags);
            let stringfiedTags = '';
            for (let i = 0; i < tags.length; i++) {
                stringfiedTags += ` - ${tags[i]}`;
            }
            console.log(stringfiedTags);
            const produto = new Produto_1.default(inputData.user_id, product_id, stringfiedTags, inputData.p_name, isOrganic, inputData.p_description, Number(inputData.p_price), inputData.p_unity, inputData.p_category, inputData.p_image);
            // console.log(inputData.p_tags);
            try {
                yield this.repository.saveProduct(produto);
                return new cadastrar_1.default("Produto criado com Sucesso", 200, false);
            }
            catch (err) {
                return new cadastrar_1.default("Erro inesperado: " + err + " Tente novamente.", 403, true);
            }
        });
    }
}
exports.default = CriarProduto;
// class Singleton{
//     private static instancea: Singleton | void;
//     private constructor(){
//     }
//     public static getInstance(): Singleton | void {
//         if (Singleton.instancea) return;
//         Singleton.instancea = new Singleton();
//         return Singleton.instancea;
//     }
// }
