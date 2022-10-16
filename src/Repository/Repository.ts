import Produtor from "../Entity/Produtor";
import Produto from "../Entity/Produto";


export default interface Repository{
    saveUser(produtor: Produtor): Promise<void>;
    getOneUser(email: string): Promise<any | null>;
    getAllUsers(): Promise<Produtor[] | null>;
    updateOneUser(email: string, produtor: Produtor): Promise<void>;
    saveProduct(produto: Produto): Promise<void>;
}