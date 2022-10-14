import Produtor from "../Entity/Produtor";

export default interface Repository{
    save(produtor: Produtor): Promise<void>;
    getOne(email: string): Promise<Produtor | null>;
    updateOne(email: string, produtor: Produtor): Promise<void>;
}