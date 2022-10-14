import InputAlterarPerfilDTO from "../DTO/input/AlterarPerfil";
import OutputCadastrarDTO from "../DTO/output/cadastrar";

import Produtor from "../Entity/Produtor";
import Repository from "../Repository/Repository";
import Cryptography from "../Services/Cryptography";



export default class AlterarPerfil {
    private repository: Repository;
    private cryptography: Cryptography;

    constructor(repository: Repository, cryptography: Cryptography) {
        this.repository = repository;
        this.cryptography = cryptography;
    }

    public async execute(tokenEmail: string, inputData: InputAlterarPerfilDTO): Promise<OutputCadastrarDTO> {
        // console.log(inputData.email)
        if (tokenEmail != inputData.email) return new OutputCadastrarDTO("Permission denied, can't alter other user information", 400, true);
        const foundUser = await this.repository.getOne(tokenEmail);
        if (!foundUser) return new OutputCadastrarDTO("Erro inesperado. usuario nao exite. Tente novamente", 400, true);

        const hashedPassword = await this.cryptography.hash();
        const produtorAtualizado = new Produtor(foundUser.getId(), inputData.name, inputData.email, hashedPassword, inputData.gender, inputData.city, inputData.birthDate, inputData.aboutMe, inputData.bio, inputData.image);

        await this.repository.updateOne(tokenEmail, produtorAtualizado);
        return new OutputCadastrarDTO("Alterado com sucesso", 200, false);
    }
}