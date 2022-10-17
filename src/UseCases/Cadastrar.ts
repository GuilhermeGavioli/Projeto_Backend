import InputCadastrarDTO from "../DTO/input/cadastrar";
import OutputCadastrarDTO from "../DTO/output/cadastrar";

import Produtor from "../Entity/Produtor";
import Repository from "../Repository/Repository";
import Cryptography from "../Services/Cryptography";

import { IdGenerator } from "../Services/IdGenerator";

export default class Cadastrar{
    private repository: Repository;
    private idGenerator: IdGenerator;
    private cryptography: Cryptography;


    constructor(repository: Repository, idGenerator: IdGenerator, cryptography: Cryptography) {
        this.repository = repository;
        this.idGenerator = idGenerator;
        this.cryptography = cryptography;
    }

    public async execute(inputData: InputCadastrarDTO): Promise<OutputCadastrarDTO> {
        const foundUser = await this.repository.findUserByEmail(inputData.email);
        if (foundUser) return new OutputCadastrarDTO("Usuario ja existe", 403, true);
        const id = this.idGenerator.generate();
        const hashedPassword = await this.cryptography.hash();
        const produtor = new Produtor(id, inputData.name, inputData.email, hashedPassword, inputData.gender, inputData.city, inputData.birthDate);
        await this.repository.saveUser(produtor);
        return new OutputCadastrarDTO("Usuario criado com sucesso", 200, false);
    }
}