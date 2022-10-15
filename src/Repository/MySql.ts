import Repository from "./Repository";
import Produtor from "../Entity/Produtor";


export default class MySql implements Repository {
    constructor(){}
    
    public async save(produtor: Produtor): Promise<void> {
        console.log('saved');
    }

    public async getOne(email: string): Promise<Produtor | null> {
        return null;
    }

    public async updateOne(email: string, updatedProdutor: Produtor): Promise<void> {
        return;
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

    public async updateOne(email: string, updatedProdutor: Produtor): Promise<void> {
        console.log('updated: ' + JSON.stringify(updatedProdutor))
        this.produtores.map(produtor => {
            if (produtor.getEmail() == email) {
                produtor.id = updatedProdutor.getId();
                produtor.name = updatedProdutor.getName();
                produtor.email = updatedProdutor.getEmail();
                produtor.password = updatedProdutor.getPassword();
                produtor.gender = updatedProdutor.gender;
                produtor.city = updatedProdutor.city;
                produtor.birthDate = updatedProdutor.birthDate;
                produtor.aboutMe = updatedProdutor.aboutMe;
                produtor.bio = updatedProdutor.bio;
                produtor.image = updatedProdutor.image;
            }
        })
    }

}