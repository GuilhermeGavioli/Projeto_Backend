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
import { UserValidation, ProductValidation } from "../Services/Validation";
import path from 'path'
import OutputCadastrarDTO from "../DTO/output/cadastrar";
import MySql from "../Repository/MySql";

export const mySqlDatabase = new MySql('localhost', 'root', 'test', 'password', 3306);
// const mySqlDatabase = 'ola'
// const mySqlDatabase = {};


// adicionar Try catch - - - - > Services/validation
export const controllers = {

    
    registerUser: async (req: Request, res: Response) => {
        try {
        const { name, email, password, confirmPassword, gender, city, bornDate } = req.body
        if (!name || !city || !email || !password || !confirmPassword || !gender || !bornDate) return res.json({ error: true, message: "Campo vazio" });
            const isValid = new UserValidation(name, email, password, confirmPassword, gender, city, bornDate, null, null, null).validate();
            if (isValid.error) return res.json(new OutputCadastrarDTO(isValid.message, isValid.status, isValid.error));
            const inputData = new InputCadastrarDTO(name,email, password, gender,city, bornDate);
            const uuid = new UUIDLibrary();
            const cryptography = new Cryptography(inputData.password);
            const cadastrar = new Cadastrar(mySqlDatabase, uuid, cryptography);
            const outputData = await cadastrar.execute(inputData);
            return res.json(outputData);
        } catch (err: any) {
            return res.json(new OutputCadastrarDTO("Algo deu errado, formato do campo é inválido. Tente novamente", 401, true))
        }
    },

    logarUser: async (req: Request, res: Response) => {
        try {
        const { email, password } = req.body
        if (!email || !password) return res.json(new OutputCadastrarDTO("Campo Vazio", 401, true))
            const isValid = new UserValidation(null, email, password, password, null, null, null, null, null, null).validate();
            if (isValid.error) return res.json(new OutputCadastrarDTO(isValid.message, isValid.status, isValid.error));
            const inputData = new InputLogarDTO(email, password);
            const authentication = new Authentication();
            const cryptography = new Cryptography(inputData.password);
            const logar = new Logar(mySqlDatabase, cryptography, authentication);
            const outputData = await logar.execute(inputData);
            return res.json(outputData);
        } catch (err: any) {
            return res.json(new OutputCadastrarDTO("Algo deu errado, formato do campo é inválido. Tente novamente", 401, true))
        }
    },

    
    updateUser: async (req: Request, res: Response) => {
        try {   
        const { name, city, password, confirmPassword, gender, birthDate, aboutMe, bio, token } = req.body
        if (!name || !city || !gender || !birthDate) return res.json({ error: true, message: "Empty field" });
            const isValid = new UserValidation(name, null, password, confirmPassword, Number(gender), city, birthDate, aboutMe, bio, req?.file?.filename).validate();
            if (isValid.error) return res.json(new OutputCadastrarDTO(isValid.message, isValid.status, isValid.error));
            let inputData;
            const isUserValid = new Authentication().validateToken(token);
            if (!isUserValid) return res.json('token invalid sir');
            if (req.file) inputData = new InputAlterarPerfilDTO(name, password, gender, city, birthDate, aboutMe, bio, req?.file?.filename);
            else inputData = new InputAlterarPerfilDTO(name, password, gender, city, birthDate, aboutMe, bio);
            const cryptography = new Cryptography(inputData.password);
            const alterarPerfil = new AlterarPerfil(mySqlDatabase, cryptography);
            const outputData = await alterarPerfil.execute(isUserValid, inputData);
            return res.json(outputData);
        } catch (err: any) {
            return res.json(new OutputCadastrarDTO("Algo deu errado, formato do campo é inválido. Tente novamente", 401, true))
        }
    },

    createProduct: async (req: Request, res: Response) => {
        try {
            const { name, isOrganic, description, price, unity, category, tags, token } = req.body
            if (!name || !isOrganic || !description || !price || !unity || !category || JSON.parse(tags).length == 0 || !req.file ) return res.json({ error: true, message: "Campo vazio!" });
            if (!token) return res.json({ error: true, message: "Não autorizado, sua sessao pode ter sido expirada!" });
            const isUserValid = new Authentication().validateToken(token);
            if (!isUserValid) return res.json('token invalid, sir');
            const inputData = new InputCriarProdutoDTO(isUserValid.user_id, tags, name, isOrganic, description, price, unity.toLowerCase(), category, req.file.filename);
            const uuid = new UUIDLibrary();
            const criarProduto = new CriarProduto(mySqlDatabase, uuid);
            const outputData = await criarProduto.execute(inputData);
            return res.json(outputData);
        } catch (err) { 
            return res.json({err: true, message: 'Algo deu errado'})
        }
    },

    deletarUser: async (req: Request, res: Response) => {
        try {
            const token = await res.locals.userInfo;
            const deletarUsuario = new DeletarUsuario(mySqlDatabase);
            const outputData = await deletarUsuario.execute(token.user_id, token.email);
            return res.json(outputData);
        } catch (err) { 
            return res.json({err: true, message: 'Algo deu errado'})
        }
    },

    acharUsuariosPorNome: async (req: Request, res: Response) => {
        try {
            const nomeprodutor = req.params.nomeprodutor.toString().toLowerCase();
            if (!nomeprodutor) return res.json({error: true, message: "Empty field"}); 
            const procurarnadescricao = req.params.procurarnadescricao.toString().toLowerCase();
            const usersFound = await mySqlDatabase.findManyUsersByName(nomeprodutor, (procurarnadescricao == "true"));
            return res.json(usersFound);
        } catch (err) { 
            return res.json({err: true, message: 'Algo deu errado'})
        }
    },

    // only public info is returned 
    acharUsuarioPorId: async (req: Request, res: Response) => {
        try {
            const idprodutor = req.params.idprodutor.toString().toLowerCase();
            if (!idprodutor) return res.render(path.join("profile", "profile"), { userFound: null });
            const userFound = await mySqlDatabase.findUserById(idprodutor) || null;
            if (!userFound) return res.json("Usuario nao existe.");
            userFound.email = ""
            userFound.user_password = ""
            res.render(path.join("profile2", "profile2"), { userFound });
        } catch (err) { 
            return res.json({err: true, message: 'Algo deu errado'})
        }
    },

    acharProdutoPorId: async (req: Request, res: Response) => {
        try {
            const idProduto = req.params.idProduto?.toString().toLowerCase();
            if (!idProduto) return res.json('id nao especificado');
            const productFound = await mySqlDatabase.findProductById(idProduto);
            if (!productFound) return res.json("Produto nao existe ou foi deletado.");
            const productFoundObj = JSON.parse(JSON.stringify(productFound));
            const productOwner = await mySqlDatabase.findUserById(productFoundObj.owner_id);
            res.render(path.join("produto", "produto"), { productFound: productFound.product, rating: productFound.rating, ownerName: productOwner?.full_name });
        } catch (err) { 
            return res.json({err: true, message: 'Algo deu errado'})
        }
    },

    deletarProduto: async (req: Request, res: Response) => {
        try {
            const productid = req.params.produtoid;
            if (!productid) return res.send('Produto nao especificado');
            const token = await res.locals.userInfo;
            const deletarProduto = new DeletarProduto(mySqlDatabase);
            const outputData = await deletarProduto.execute(productid.toString(), token.user_id);
            return res.json(outputData);
        } catch (err) { 
            return res.json({err: true, message: 'Algo deu errado'})
        }
    },

    getProdutos: async (req: Request, res: Response) => {
        try {
            const nomeProduto = req.query.nomeProduto?.toString().toLowerCase();
            const pack = req.query.pack?.toString().toLowerCase();
            if (!nomeProduto || !pack) return res.json('Informacao de Produto nao especificada')
            const productsFound = await mySqlDatabase.findManyProductsByName(nomeProduto, Number(pack));
            return res.json(productsFound)
        
        } catch (err) {
            console.log(err)
            return res.json('Querry invalida')
        }
    },

    getProdutosByCategory: async (req: Request, res: Response) => {
        try {
            const pack = req.query.pack?.toString().toLowerCase();
            const category = req.query.categoria?.toString().toLowerCase();
            if (!pack || !category) return res.json('Informacao de Produto nao especificada')
            const productsFound = await mySqlDatabase.findManyProductsByCategory(category, Number(pack));
            return res.json(productsFound)
        } catch (err) {
            console.log(err)
            return res.json('Querry invalida')
        }
    },

    getProdutosFromUser: async (req: Request, res: Response) => {
        try {
            const token_id = res.locals.userInfo.user_id;
            if (!token_id) return res.json('Nao autorizado - Requisiçao negada, sua sessao pode ter expirado.')
            const productsFound = await mySqlDatabase.findProductsFromUser(token_id);
            return res.json(productsFound);
        } catch (err) { 
            return res.json({err: true, message: 'Algo deu errado'})
        }
    },

    authValidation: async (req: Request, res: Response) => {
        try {
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
        } catch (err) { 
            return res.json({err: true, message: 'Algo deu errado'})
        }
    }

}

