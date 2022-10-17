import 'dotenv/config'
import express, {Request, Response, NextFunction} from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
import cors from 'cors'

const corsOptions = {
    origin: 'http://localhost.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors())

console.log('hi2')
import mysql from 'mysql2'

console.log(process.env.ABC);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')



app.get('/pagecadastrar',(req, res) => { 
    res.render("cadastrar");
})

app.get('/pagelogin',(req, res) => { 
    res.render("login");
})

app.get('/pagehome', ProtectionAgainstAuthenticatedUsers,(req, res) => { 
    res.render("home");
})

app.get('/pagealterarusuario', ProtectionAgainstAuthenticatedUsers,(req, res) => { 
    res.render("alterar");
})

app.get('/pagecriarproduto', ProtectionAgainstAuthenticatedUsers,(req, res) => { 
    res.render("criarproduto");
})





// dbfunctions();
import MySql from './Repository/MySql';
const mySqlDatabase = new MySql('localhost', 'root', 'test', 'password', 3306);



// import { InMemoryImpl } from './Repository/InMemoryRepo'
// const inMemoryRepo = new InMemoryImpl();

import AlterarPerfil from './UseCases/AlterarPerfil'
import Cryptography from './Services/Cryptography'

import InputAlterarPerfilDTO from './DTO/input/AlterarPerfil'
app.post('/alterarPerfil', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => {
    const { name, city, password, gender, birthDate, aboutMe, bio, image } = req.body
    if (!name || !city || !password || !gender || !birthDate) return res.send('empty field');
    const inputData = new InputAlterarPerfilDTO(name, password, gender, city, birthDate, aboutMe, bio, image );
    
    const token = await res.locals.userInfo;

    
    
    const cryptography = new Cryptography(inputData.password);
    
    const alterarPerfil = new AlterarPerfil(mySqlDatabase, cryptography);
    // nao e so pq ele tem o token, que ele pode editar, é preciso validar se o usuario a ser editado é o mesmo do dentro do token :)
    const outputData = await alterarPerfil.execute(token, inputData);
    return res.json(outputData);
   
})


import InputCriarProdutoDTO from './DTO/input/CriarProdutoDTO'
import CriarProduto from './UseCases/CriarProduto'
app.post('/criarProduto', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => {
    const { name, description, image} = req.body
    if (!name || !description || !image) return res.send('empty field');
    
    const token = await res.locals.userInfo;
    console.log(token);
    const inputData = new InputCriarProdutoDTO(token.user_id, name, description, image);
    
    const uuid = new UUIDLibrary();
    const outputData = await new CriarProduto(mySqlDatabase, uuid).execute(inputData);
    return res.json(outputData);

})


import InputCadastrarDTO from './DTO/input/cadastrar'
import Cadastrar from './UseCases/Cadastrar'


import { UUIDLibrary } from './Services/IdGenerator'

import OutputCadastrarDTO from './DTO/output/cadastrar'
import Authentication from './Services/Authentication';



app.post('/cadastrar',ProtectionAgainstAuthenticatedUsers, async (req: Request, res: Response) => {
    const { name, email, password, gender, city, bornDate } = req.body
    if (!name || !city || !email || !password || !gender || !bornDate) return res.send('empty field');
   
    
    const inputData = new InputCadastrarDTO(name,email, password, gender,city, bornDate);

  

    const uuid = new UUIDLibrary();
    const cryptography = new Cryptography(inputData.password);

    const cadastrar = new Cadastrar(mySqlDatabase, uuid, cryptography);
    const outputData = await cadastrar.execute(inputData);
    
    return res.json(outputData);
})

app.get('/get', async (req, res) => {
    const allUsers = await mySqlDatabase.getAllUsers();
    return res.json(allUsers);
})

app.get('/get/:procurarnadescricao/:nomeprodutor', async (req, res) => {
    const nomeprodutor = req.params.nomeprodutor.toString().toLowerCase();
    const procurarnadescricao = req.params.procurarnadescricao.toString().toLowerCase();
    console.log(nomeprodutor);
    const usersFound = await mySqlDatabase.findManyUsersByName(nomeprodutor, (procurarnadescricao == "true"));
    console.log(usersFound)
    return res.json(usersFound);
})

app.get('/getproduto/:procurarnadescricao/:nomeproduto', async (req, res) => {
    const nomeproduto = req.params.nomeproduto.toString().toLowerCase();
    const procurarnadescricao = req.params.procurarnadescricao.toString().toLowerCase();
    console.log(nomeproduto);
    const productFound = await mySqlDatabase.findManyProductsByName(nomeproduto, (procurarnadescricao == "true"));
    console.log(productFound)
    return res.json(productFound);
})

app.get('/getprodutosfromUser/:idprodutor', async (req, res) => {
    const idprodutor = req.params.idprodutor.toString().toLowerCase();
    const productFound = await mySqlDatabase.findProductsFromUser(idprodutor);
    return res.json(productFound);
})

import InputLogarDTO from './DTO/input/logar';
import Logar from './UseCases/Logar';
import DeletarUsuario from './UseCases/DeletarUsuario';
import DeletarProduto from './UseCases/DeletarProduto';

app.post('/login', ProtectionAgainstAuthenticatedUsers, async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) return res.send('error')
    const inputData = new InputLogarDTO(email, password);

    const authentication = new Authentication();
    const cryptography = new Cryptography(inputData.password);

    const logar = new Logar(mySqlDatabase, cryptography, authentication);
    const outputData = await logar.execute(inputData);
    return res.json(outputData);

})

app.post('/deleteUser', ProtectionAgainstNonAuthenticatedUsers, async (req: Request, res: Response) => {
    const { password } = req.body
    if (!password) return res.send('error')

    const token = await res.locals.userInfo;

    
    const cryptography = new Cryptography(password);
    const deletarUsuario = new DeletarUsuario(mySqlDatabase, cryptography);

    const outputData = await deletarUsuario.execute(token.user_id, token.email);
    return res.json(outputData);
})

app.post('/deleteProduct', ProtectionAgainstNonAuthenticatedUsers, async (req: Request, res: Response) => {
    const { product_id } = req.body
    if (!product_id) return res.send('error')

    const token = await res.locals.userInfo;

    const deletarProduto = new DeletarProduto(mySqlDatabase);

    const outputData = await deletarProduto.execute(product_id, token.user_id);
    return res.json(outputData);

})

async function ProtectionAgainstAuthenticatedUsers(req: Request, res: Response, next: NextFunction) {
    console.log('hi')
    const tokenSent = req.headers['authorization']
    if (!tokenSent) return next();
    console.log(tokenSent)
    const authentication = new Authentication();
    const userTokenFormated = authentication.validateToken(tokenSent);
    if (!userTokenFormated) return next();
    console.log(userTokenFormated)
    const outputData = new OutputCadastrarDTO("User is already authenticated", 401, true)
    // return res.render("login");
    return res.json(outputData);
}

async function ProtectionAgainstNonAuthenticatedUsers (req: Request, res: Response, next: NextFunction) {
    const tokenSent = req.headers['authorization'];
    const outputData = new OutputCadastrarDTO("Permission denied, please login to use this resource", 403, true);
    
    if (!tokenSent) return res.json(outputData);

    const authentication = new Authentication();
    const userTokenFormated = authentication.validateToken(tokenSent);


    if (!userTokenFormated) return res.json(outputData);
    res.locals.userInfo = userTokenFormated;
    
    next();
}

app.get('/auth', (req: Request, res: Response) => {
    console.log('hello')
    const tokenSent = req.headers['authorization'];
    if (!tokenSent) return res.json({ auth: false });
    console.log(tokenSent)
    const authentication = new Authentication();
    const userTokenFormated = authentication.validateToken(tokenSent);
    if (!userTokenFormated) return res.json({ auth: false });
    return res.json({ auth: true });
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ... ${PORT}`))
