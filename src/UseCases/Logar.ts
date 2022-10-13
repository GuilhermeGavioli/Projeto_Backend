import InputLogarDTO from "../DTO/input/logar";
import OutputLogarDTO from "../DTO/output/logar";
import PayloadInfoDTO from "../DTO/input/PayloadDTO"

import Repository from "../Repository/Repository";
import Authentication from "../Services/Authentication";
import Cryptography from "../Services/Cryptography";


export default class Logar{
    private repository: Repository;
    private cryptography: Cryptography;
    private authentication: Authentication;
  
    constructor(repository: Repository, cryptography: Cryptography, authentication: Authentication) {
        this.repository = repository;
        this.cryptography = cryptography;
        this.authentication = authentication;
    }

    public async execute(inputData: InputLogarDTO): Promise<OutputLogarDTO> {

        const userFound = await this.repository.getOne(inputData.email);
        if (!userFound) return new OutputLogarDTO("Usuario nao encontrado", 404, true);
        
        const passwordsMatch = await this.cryptography.compare(userFound.getPassword());
        if (!passwordsMatch) return new OutputLogarDTO("Senhas nao correspondem", 404, true);
    
        const payload = new PayloadInfoDTO(userFound.getId(), userFound.getName(), userFound.getEmail(), "");
        const payloadObject = await payload.getPayloadObject();
        const token = await this.authentication.generateToken(payloadObject);
        return new OutputLogarDTO("logado", 200, false, token);
    }
}