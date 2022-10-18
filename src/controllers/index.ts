import { Request, Response } from "express";
import InputAlterarPerfilDTO from "../DTO/input/AlterarPerfil";
import InputCadastrarDTO from "../DTO/input/cadastrar";
import InputCriarProdutoDTO from "../DTO/input/CriarProdutoDTO";
import InputLogarDTO from "../DTO/input/logar";
import Authentication from "../Services/Authentication";
import Cryptography from "../Services/Cryptography";
import { UUIDLibrary } from "../Services/IdGenerator";
import AlterarPerfil from "../UseCases/AlterarPerfil";
import Cadastrar from "../UseCases/Cadastrar";
import CriarProduto from "../UseCases/CriarProduto";
import DeletarProduto from "../UseCases/DeletarProduto";
import DeletarUsuario from "../UseCases/DeletarUsuario";
import Logar from "../UseCases/Logar";


// Same instance of conection
import { mySqlDatabase } from "..";


// adicionar validation - - - - > Services/validation
export const controllers = {
    
    registerUser: async (req: Request, res: Response) => {
        const { name, email, password, gender, city, bornDate } = req.body
        if (!name || !city || !email || !password || !gender || !bornDate) return res.json({error: true, message: "Empty field"});
        const inputData = new InputCadastrarDTO(name,email, password, gender,city, bornDate);
        const uuid = new UUIDLibrary();
        const cryptography = new Cryptography(inputData.password);
        const cadastrar = new Cadastrar(mySqlDatabase, uuid, cryptography);
        const outputData = await cadastrar.execute(inputData);
        return res.json(outputData);
    },

    logarUser: async (req: Request, res: Response) => {
        const { email, password } = req.body
        if (!email || !password) return res.send('error')
        const inputData = new InputLogarDTO(email, password);
        const authentication = new Authentication();
        const cryptography = new Cryptography(inputData.password);
        const logar = new Logar(mySqlDatabase, cryptography, authentication);
        const outputData = await logar.execute(inputData);
        return res.json(outputData);
    },

    alterarUser: async (req: Request, res: Response) => {
        const { name, city, password, gender, birthDate, aboutMe, bio, image } = req.body
        if (!name || !city || !password || !gender || !birthDate) return res.json({error: true, message: "Empty field"});
        const inputData = new InputAlterarPerfilDTO(name, password, gender, city, birthDate, aboutMe, bio, image );
        const token = await res.locals.userInfo;
        const cryptography = new Cryptography(inputData.password);
        const alterarPerfil = new AlterarPerfil(mySqlDatabase, cryptography);
        const outputData = await alterarPerfil.execute(token, inputData);
        return res.json(outputData);
    },

    deletarUser: async (req: Request, res: Response) => {
        const { password } = req.body
        if (!password) return res.send('error')
        const token = await res.locals.userInfo;
        const cryptography = new Cryptography(password);
        const deletarUsuario = new DeletarUsuario(mySqlDatabase, cryptography);
        const outputData = await deletarUsuario.execute(token.user_id, token.email);
        return res.json(outputData);
    },

    acharUsuariosPorNome: async (req: Request, res: Response) => {
        const nomeprodutor = req.params.nomeprodutor.toString().toLowerCase();
        const procurarnadescricao = req.params.procurarnadescricao.toString().toLowerCase();
        console.log(nomeprodutor);
        const usersFound = await mySqlDatabase.findManyUsersByName(nomeprodutor, (procurarnadescricao == "true"));
        console.log(usersFound)
        return res.json(usersFound);
    },

    criarProduto: async (req: Request, res: Response) => {
        const { name, description, image} = req.body
        if (!name || !description || !image) return res.json({error: true, message: "Empty field"});
        const token = await res.locals.userInfo;
        console.log(token);
        const inputData = new InputCriarProdutoDTO(token.user_id, name, description, image);
        const uuid = new UUIDLibrary();
        const outputData = await new CriarProduto(mySqlDatabase, uuid).execute(inputData);
        return res.json(outputData);
    },

    deletarProduto: async (req: Request, res: Response) => {
        const { product_id } = req.body
        if (!product_id) return res.send('error')
        const token = await res.locals.userInfo;
        const deletarProduto = new DeletarProduto(mySqlDatabase);
        const outputData = await deletarProduto.execute(product_id, token.user_id);
        return res.json(outputData);
    },

    getProdutos: async (req: Request, res: Response) => {
        const nomeproduto = req.params.nomeproduto.toString().toLowerCase();
        const procurarnadescricao = req.params.procurarnadescricao.toString().toLowerCase();
        console.log(nomeproduto);
        const productFound = await mySqlDatabase.findManyProductsByName(nomeproduto, (procurarnadescricao == "true"));
        console.log(productFound)
        return res.json(productFound);
    },

    authValidation: (req: Request, res: Response) => {
        const tokenSent = req.headers['authorization'];
        if (!tokenSent) return res.json({ auth: false });
        const authentication = new Authentication();
        const userTokenFormated = authentication.validateToken(tokenSent);
        if (!userTokenFormated) return res.json({ auth: false });
        return res.json({ auth: true });
    }

}

