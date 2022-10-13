import InputAlterarPerfilDTO from "../DTO/input/AlterarPerfil";
import OutputCadastrarDTO from "../DTO/output/cadastrar";

import Produtor from "../Entity/Produtor";
import Repository from "../Repository/Repository";
import Cryptography from "../Services/Cryptography";



export default class AlterarPerfil {
    private repository: Repository;
    // private cryptography: Cryptography;

    constructor(repository: Repository) {
        this.repository = repository;
        // this.cryptography = cryptography;
    }

    public async execute(tokenEmail: string, inputData: InputAlterarPerfilDTO): Promise<OutputCadastrarDTO> {
        // const hashedPassword = await this.cryptography.hash();
        if (tokenEmail != inputData.email) return new OutputCadastrarDTO("Permission denied, can't alter other user information", 400, true);

        const produtor = new Produtor(input, inputData.name, inputData.email, hashedPassword, inputData.gender, inputData.birthDate);
        await this.repository.updateOne(produtor);
        return new OutputCadastrarDTO("Alterado com sucesso", 200, false);
    }
}