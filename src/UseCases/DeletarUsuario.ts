import InputCadastrarDTO from "../DTO/input/cadastrar";
import OutputCadastrarDTO from "../DTO/output/cadastrar";

import Produtor from "../Entity/Produtor";
import Repository from "../Repository/Repository";
import Cryptography from "../Services/Cryptography";



export default class DeletarUsuario{
    private repository: Repository;
    // private cryptography: Cryptography;


    constructor(repository: Repository) {
        this.repository = repository;

        // this.cryptography = cryptography;
    }

    public async execute(userid: string, user_email: string): Promise<OutputCadastrarDTO> {
        const foundUser = await this.repository.findUserByEmail(user_email);
        if (!foundUser) return new OutputCadastrarDTO("Usuario nao existe", 403, true);
        

        // const passwordsMatch = await this.cryptography.compare(foundUser.user_password);

        // if (!passwordsMatch) return new OutputCadastrarDTO("Passwords do not match", 403, true);
        await this.repository.deleteOneUser(userid, user_email);
        return new OutputCadastrarDTO("Usuario deletado com sucesso", 200, false);
    }
}