import Repository from "./Repository";
import Produtor from "../Entity/Produtor";
import Produto from "../Entity/Produto";

import GetOneOutputDTO from "../DTO/output/GetOneDTO";

// export class InMemoryImpl implements Repository { 
//     private produtores: Produtor[] = [];

//     constructor() { }
    
//     public async saveUser(produtor: Produtor): Promise<void> {
//         this.produtores.push(produtor);
//         console.log('saved');
//     }
    
//     public async getOneUser(email: string): Promise<GetOneOutputDTO | null> {
//         // return this.produtores.find(produtor => produtor.getEmail() == email) || null;
//         return null;
//     }

//     public async getAllUsers(): Promise<GetOneOutputDTO[] | null> {
//         return null;
//         // return this.produtores;
//     }

//     public async updateOneUser(email: string, updatedProdutor: Produtor): Promise<void> {
//         console.log('updated: ' + JSON.stringify(updatedProdutor))
//         this.produtores.map(produtor => {
//             if (produtor.getEmail() == email) {
//                 produtor.id = updatedProdutor.getId();
//                 produtor.name = updatedProdutor.getName();
//                 produtor.email = updatedProdutor.getEmail();
//                 produtor.password = updatedProdutor.getPassword();
//                 produtor.gender = updatedProdutor.gender;
//                 produtor.city = updatedProdutor.city;
//                 produtor.birthDate = updatedProdutor.birthDate;
//                 produtor.aboutMe = updatedProdutor.aboutMe;
//                 produtor.bio = updatedProdutor.bio;
//                 produtor.image = updatedProdutor.image;
//             }
//         })
//     }

//     public async saveProduct(produto: Produto): Promise<void> {

//     } 

// }