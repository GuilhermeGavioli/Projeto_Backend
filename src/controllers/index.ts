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

import Validation, { UserValidation } from "../Services/Validation";

import path from 'path'



// Same instance of conection
// import { mySqlDatabase } from "..";
import OutputCadastrarDTO from "../DTO/output/cadastrar";

import MySql from "../Repository/MySql";
export const mySqlDatabase = new MySql('localhost', 'root', 'test', 'password', 3306);
// const mySqlDatabase;
// const msysqlDatabase = 'hello';
// adicionar Try catch - - - - > Services/validation
export const controllers = {

    
    registerUser: async (req: Request, res: Response) => {
        const { name, email, password, confirmPassword, gender, city, bornDate } = req.body
        if (!name || !city || !email || !password || !confirmPassword || !gender || !bornDate) return res.json({ error: true, message: "Campo vazio" });

        try {   
            const isValid = new UserValidation(name, email, password, confirmPassword, gender, city, bornDate, null, null, null).validate();
            if (isValid.error) return res.json(new OutputCadastrarDTO(isValid.message, isValid.status, isValid.error));
        } catch (err: any) {
            return res.json(new OutputCadastrarDTO("Algo deu errado, formato do campo é inválido. Tente novamente", 401, true))
        }
        

        const inputData = new InputCadastrarDTO(name,email, password, gender,city, bornDate);
        const uuid = new UUIDLibrary();
        const cryptography = new Cryptography(inputData.password);
        const cadastrar = new Cadastrar(mySqlDatabase, uuid, cryptography);
        const outputData = await cadastrar.execute(inputData);
        return res.json(outputData);
    },

    logarUser: async (req: Request, res: Response) => {
        const { email, password } = req.body
        if (!email || !password) return res.json(new OutputCadastrarDTO("Campo Vazio", 401, true))

        try {
            const isValid = new UserValidation(null, email, password, password, null, null, null, null, null, null).validate();
            if (isValid.error) return res.json(new OutputCadastrarDTO(isValid.message, isValid.status, isValid.error));
        } catch (err: any) {
            return res.json(new OutputCadastrarDTO("Algo deu errado, formato do campo é inválido. Tente novamente", 401, true))
        }

        const inputData = new InputLogarDTO(email, password);
        const authentication = new Authentication();
        const cryptography = new Cryptography(inputData.password);
        const logar = new Logar(mySqlDatabase, cryptography, authentication);
        const outputData = await logar.execute(inputData);
        return res.json(outputData);
    },

    alterarUser: async (req: Request, res: Response) => {
        const { name, city, password, gender, birthDate, aboutMe, bio, image } = req.body
        if (!name || !city || !gender || !birthDate) return res.json({ error: true, message: "Empty field" });
        
        

        const inputData = new InputAlterarPerfilDTO(name, password, gender, city, birthDate, aboutMe, bio, image );
        const token = await res.locals.userInfo;
        const cryptography = new Cryptography(inputData.password);
        const alterarPerfil = new AlterarPerfil(mySqlDatabase, cryptography);
        const outputData = await alterarPerfil.execute(token, inputData);
        return res.json(outputData);
    },

    alterarUserWithImageTest: async (req: Request, res: Response) => {
        const { name, city, password, confirmPassword, gender, birthDate, aboutMe, bio, token } = req.body

        if (!name || !city || !gender || !birthDate) return res.json({ error: true, message: "Empty field" });
       
        console.log(req.file)

        try {   
            const isValid = new UserValidation(name, null, password, confirmPassword, Number(gender), city, birthDate, aboutMe, bio, req?.file?.filename).validate();
            if (isValid.error) return res.json(new OutputCadastrarDTO(isValid.message, isValid.status, isValid.error));
        } catch (err: any) {
            return res.json(new OutputCadastrarDTO("Algo deu errado, formato do campo é inválido. Tente novamente", 401, true))
        }

        let inputData;

        const isUserValid = new Authentication().validateToken(token);
        if (!isUserValid) return res.json('token invalid sir');
      

       
        if (req.file) inputData = new InputAlterarPerfilDTO(name, password, gender, city, birthDate, aboutMe, bio, req?.file?.filename);
        else inputData = new InputAlterarPerfilDTO(name, password, gender, city, birthDate, aboutMe, bio);

        const cryptography = new Cryptography(inputData.password);
        const alterarPerfil = new AlterarPerfil(mySqlDatabase, cryptography);
          

        const outputData = await alterarPerfil.execute(isUserValid, inputData);
        return res.json(outputData);

    },

    criarProdutoWithImageTeste: async (req: Request, res: Response) => {
   

        console.log('here')
        const { name, description, token } = req.body
        if (!name || !description || !req.file || !token) return res.json({ error: true, message: "Empty field" });

        const isUserValid = new Authentication().validateToken(token);
        if (!isUserValid) return res.json('token invalid sir');
      
        const inputData = new InputCriarProdutoDTO(isUserValid.user_id, name, description, req.file.filename);

        const uuid = new UUIDLibrary();
        const outputData = await new CriarProduto(mySqlDatabase, uuid).execute(inputData);
        return res.json(outputData);
    },

    deletarUser: async (req: Request, res: Response) => {
        const token = await res.locals.userInfo;
        const deletarUsuario = new DeletarUsuario(mySqlDatabase);
        const outputData = await deletarUsuario.execute(token.user_id, token.email);
        return res.json(outputData);
    },

    acharUsuariosPorNome: async (req: Request, res: Response) => {
        const nomeprodutor = req.params.nomeprodutor.toString().toLowerCase();
        console.log(nomeprodutor)
        if (!nomeprodutor) return res.json({error: true, message: "Empty field"}); 
        const procurarnadescricao = req.params.procurarnadescricao.toString().toLowerCase();
        const usersFound = await mySqlDatabase.findManyUsersByName(nomeprodutor, (procurarnadescricao == "true"));
        return res.json(usersFound);
    },

    // only public info is returned 
    
    acharUsuarioPorId: async (req: Request, res: Response) => {
        const idprodutor = req.params.idprodutor.toString().toLowerCase();
        if (!idprodutor) return res.render(path.join("profile", "profile"), { userFound: null });
        const userFound = await mySqlDatabase.findUserById(idprodutor) || null;
        if (!userFound) return res.json("Usuario nao existe.");
        userFound.email = ""
        userFound.user_password = ""
        console.log('found', userFound)
        res.render(path.join("test2", "test2"), { userFound });
    },

    acharProdutoPorId: async (req: Request, res: Response) => {
        console.log(req.params)
        const idProduto = req.params.idProduto?.toString().toLowerCase();
        if (!idProduto) return res.json('id nao especificado');
        const productFound = await mySqlDatabase.findProductById(idProduto);
        console.log('p ' + productFound)
        if (!productFound) return res.json("Produto nao existe ou foi deletado.");
        console.log(productFound)
        res.render(path.join("produto", "produto"), { productFound } );
    },

    criarProduto: async (req: Request, res: Response) => {
        const { name, description, image} = req.body
        if (!name || !description || !image) return res.json({error: true, message: "Empty field"});
        const token = await res.locals.userInfo;
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

    //alterar produtos
//'/getproduto/:procurarnadescricao/:nomeproduto'
    getProdutos: async (req: Request, res: Response) => {
        console.log('hellothere')
        const nomeProduto = req.query.nomeProduto?.toString().toLowerCase();
        const number = req.query.number?.toString().toLowerCase();
        const procurarnadescricao = req.query.queryDescriptionAlso?.toString().toLowerCase();
        console.log(nomeProduto, procurarnadescricao, number)
        if (!nomeProduto || !number) return res.json('n tem')
        const productsFound = await mySqlDatabase.findManyProductsByName(nomeProduto, (procurarnadescricao == "true"), Number(number));
      
        if (number !== '0') return res.json(productsFound)
        return res.render(path.join("TEMPLATE", "index.ejs"), { productsFound, nomeProduto });
    },

    getProdutosFromUser: async (req: Request, res: Response) => {
        console.log('aqui')
        const produtorId = req.params.produtorId.toString().toLowerCase();
        console.log(produtorId)
        const productsFound = await mySqlDatabase.findProductsFromUser(produtorId);
        console.log(productsFound)
        // return res.json(productsFound);
        return res.render(path.join("template", "test2"), productsFound );
    },

    authValidation: async (req: Request, res: Response) => {
        const tokenSent = req.headers['authorization'];
        const infoRequired = req.headers['required_info'];

       

        if (!tokenSent) return res.json({ auth: false });
        const authentication = new Authentication();
        const userTokenFormated = authentication.validateToken(tokenSent);
        if (!userTokenFormated) return res.json({ auth: false });
        res.locals.userInfo = userTokenFormated;

        if (infoRequired === "*") {
            const fullUser = await mySqlDatabase.findUserByEmail(userTokenFormated.email);
            if (fullUser?.user_password) fullUser.user_password = "";
            return res.json({auth: true, fullUser})
        }
        return res.json({ auth: true });
    }

}

