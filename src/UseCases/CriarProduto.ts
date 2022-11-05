import Repository from '../Repository/Repository'
import InputCriarProdutoDTO from '../DTO/input/CriarProdutoDTO'
import Produto from '../Entity/Produto';
import { IdGenerator } from '../Services/IdGenerator';
import OutputCadastrarDTO from '../DTO/output/cadastrar';
import Validation from '../Services/Validation';

export default class CriarProduto{
    private repository: Repository;
    private idGenerator: IdGenerator;
    private validation: Validation;

    constructor(repository: Repository, idGenerator: IdGenerator, validation: Validation) {
        this.repository = repository;
        this.idGenerator = idGenerator;
        this.validation = validation;
    }

    public async execute(inputData: InputCriarProdutoDTO): Promise<OutputCadastrarDTO> {
        const product_id = this.idGenerator.generate();
        const isValid = this.validation.validate()
        if (isValid.error) return new OutputCadastrarDTO(isValid.message, isValid.status, isValid.error);
        const isOrganic = inputData.p_isOrganic.toString().toLowerCase() == 'true' ? 1 : 0;
    
        const tags = JSON.parse(inputData.p_tags);
        console.log(tags)
        let stringfiedTags = '';
        for (let i = 0; i < tags.length; i++){
            stringfiedTags += ` - ${tags[i]}`;
        }
        console.log(stringfiedTags)
        
     
        const produto = new Produto(
            inputData.user_id,
            product_id,
            stringfiedTags,
            inputData.p_name,
            isOrganic,
            inputData.p_description,
            Number(inputData.p_price),
            inputData.p_unity,
            inputData.p_category,
            inputData.p_image,
        );
        // console.log(inputData.p_tags);
        
        try {
            await this.repository.saveProduct(produto);
            return new OutputCadastrarDTO("Produto criado com Sucesso", 200, false);
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