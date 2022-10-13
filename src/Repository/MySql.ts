import Repository from "./Repository";
import Produtor from "../Entity/Produtor";


export default class MySql implements Repository{
    constructor(){}
    
    public async save(produtor: Produtor): Promise<void> {
        console.log('saved');
    }

    public async getOne(email: string): Promise<Produtor | null> {
        return null;
    }

    public async updateOne(produtor: Produtor ): Promise<void> {
        
    }
}

import InputAlterarPerfilDTO from "../DTO/input/AlterarPerfil";

export class InMemoryImpl implements Repository { 
    private produtores: Produtor[] = [];

    constructor() { }
    
    public async save(produtor: Produtor): Promise<void> {
        this.produtores.push(produtor);
        console.log('saved');
    }
    
    public async getOne(email: string): Promise<Produtor | null> {
        return this.produtores.find(produtor => produtor.getEmail() == email) || null;
    }

    public getAll(): Produtor[] {
        return this.produtores;
    }

    public updateOne(email: string, newInputs: InputAlterarPerfilDTO): Promise<void> {
        let idToBeStored;
        const foundProdutor = this.produtores.map(produtor => {
            if (produtor.getEmail() == email) {
                idToBeStored = produtor.getId();
                produtor = new Produtor(idToBeStored, newInputs.);
            }
        })
  

        newInputs.aboutMe
        console.log('updated');
    }

}