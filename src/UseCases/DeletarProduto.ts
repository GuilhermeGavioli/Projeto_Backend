import InputCadastrarDTO from "../DTO/input/cadastrar";
import OutputCadastrarDTO from "../DTO/output/cadastrar";

import Produtor from "../Entity/Produtor";
import Repository from "../Repository/Repository";




export default class DeletarProduto{
    private repository: Repository;



    constructor(repository: Repository) {
        this.repository = repository;
    }

    public async execute(product_id: string, token_user_id: string): Promise<OutputCadastrarDTO> {
        const foundProduct = await this.repository.findProduct(product_id, token_user_id);
        if (!foundProduct) return new OutputCadastrarDTO("Produto nao encontrado", 403, true);
        
        try {
            await this.repository.deleteOneProduct(foundProduct.product_id, token_user_id);
            return new OutputCadastrarDTO("Produto deletado com sucesso", 200, false);
        } catch (err) { 
            return new OutputCadastrarDTO('Erro, produto pode nao pertencer a voce.' + err, 500, true);
        }
    }
}