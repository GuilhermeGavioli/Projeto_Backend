import InputAlterarPerfilDTO from "../DTO/input/AlterarPerfil";
import OutputCadastrarDTO from "../DTO/output/cadastrar";
import PayloadInfoDTO from "../DTO/input/PayloadDTO";

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

    public async execute(token: PayloadInfoDTO, inputData: InputAlterarPerfilDTO): Promise<OutputCadastrarDTO> {

        const foundUser = await this.repository.findUserByEmail(token.email);
        if (!foundUser) return new OutputCadastrarDTO("Erro inesperado. usuario nao exite. Tente novamente", 400, true);

        if (token.email !== foundUser.email) return new OutputCadastrarDTO("Permission denied. Can't alter other user information. emails don't match", 400, true);
        if (token.user_id !== foundUser.userid) return new OutputCadastrarDTO("Permission denied. Can't alter other user information. ids don't match", 400, true);

        const hashedPassword = await this.cryptography.hash();
        
        const produtorAtualizado = new Produtor(foundUser.userid, inputData.name, token.email, hashedPassword, inputData.gender, inputData.city, inputData.birthDate, inputData.aboutMe, inputData.bio, inputData.image);
        
        if (inputData.password.trim() == "") produtorAtualizado.password = foundUser.user_password


        try {
            await this.repository.updateOneUser(token.email, produtorAtualizado);
            return new OutputCadastrarDTO("Alterado com sucesso", 200, false);
        } catch (err) {
            return new OutputCadastrarDTO("Algo inesperado aconteceu. Tente novamente", 403, true);
        }
    }
}