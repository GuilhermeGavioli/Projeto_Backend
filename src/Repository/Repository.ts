import Produtor from "../Entity/Produtor";
import Produto from "../Entity/Produto";
import GetOneOutputDTO from "../DTO/output/GetOneDTO";
import InputCriarProdutoDTO from "../DTO/input/CriarProdutoDTO";

export default interface Repository{
    saveUser(produtor: Produtor): Promise<void>;
    findUserByEmail(email: string): Promise<GetOneOutputDTO | null>;
    findUserById(id: string): Promise<GetOneOutputDTO | null>;

    findManyUsersByName(name: string, queryDescriptionAlso: boolean): Promise<GetOneOutputDTO[] | null>; 
    getAllUsers(): Promise<GetOneOutputDTO[] | null>;
    updateOneUser(email: string, produtor: Produtor): Promise<void>;
    saveProduct(produto: Produto): Promise<void>;
    deleteOneUser(id: string, email: string): Promise<void>;

    findProductsFromUser(userid: string, number: number): Promise<any | null>
    findProduct(id: string, owner_id: string): Promise<any | null>
    deleteOneProduct(product_id: string, token_user_id: string): Promise<void>
}