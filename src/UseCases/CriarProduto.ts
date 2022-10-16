import Repository from '../Repository/Repository'
import InputCriarProdutoDTO from '../DTO/input/CriarProdutoDTO'
import Produto from '../Entity/Produto';
import { IdGenerator } from '../Services/IdGenerator';
import OutputCadastrarDTO from '../DTO/output/cadastrar';

export default class CriarProduto{
    private repository: Repository;
    private idGenerator: IdGenerator;

    constructor(repository: Repository, idGenerator: IdGenerator) {
        this.repository = repository;
        this.idGenerator = idGenerator;
    }

    public async execute(inputData: InputCriarProdutoDTO): Promise<OutputCadastrarDTO> {
        const id = this.idGenerator.generate();
        const produto = new Produto(inputData.user_id, id, inputData.p_name, inputData.p_description, inputData.p_image);
        try {
            await this.repository.saveProduct(produto);
            return new OutputCadastrarDTO("Produto criado com Sucesso", 200, true);
        } catch (err) {
            return new OutputCadastrarDTO("Erro inesperado: " + err + " Tente novamente.", 403, true);
        }
    }
}



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