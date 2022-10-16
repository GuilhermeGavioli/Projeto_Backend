import 'dotenv/config'
import express, {Request, Response, NextFunction} from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('hi2')
import mysql from 'mysql2'

console.log(process.env.ABC);


// async function dbfunctions() {
    
//     try {
        
//         const conn: mysql.Connection = mysql.createConnection({
//             host: 'localhost',
//             user: 'root',
//             database: 'test',
//             password: 'password',
//             port: 3306
//         });
//         console.log('connected');
//         conn.query("SELECT * FROM user;", function (err, results, fields) {
//             if (err) console.log('ERRORRRR '+ err)
//             console.log(results);
//         });

//         conn.query(
//             'INSERT INTO user (userid, full_name, email, user_password, user_gender, addr_state, birth_date, created_at) VALUES (" ", "Joao", "joao@gmail.com", "123", 1, "SP","2000-01-14", "2022-10-15");', function (err, results, fields) {
//             if (err) console.log('ERRORRRR from insert '+ err)
//             console.log(results);
//         });

//         conn.query(
//             'INSERT INTO product (product_id, product_name, product_image, owner_id, created_at) VALUES ("1515a", "laranja", "foto154", "a6d1ac", "2022-10-15");', function (err, results, fields) {
//             if (err) console.log('ERRORRRR from insert '+ err)
//             console.log(results);
//         });
//         // conn.query(
//         //     'INSERT INTO product (product_id, product_name, product_image, owner_id, created_at) VALUES ("af16b", "laranja", "foto154", "a6d1ac", "2022-10-15");', function (err, results, fields) {
//         //     if (err) console.log('ERRORRRR from insert '+ err)
//         //     console.log(results);
//         // });
        
     
        
//         conn.query("SELECT * FROM product;", function(err, results, fields) {
//             console.log(results);
//         });
//         conn.query("SELECT * FROM user;", function(err, results, fields) {
//             console.log(results);
//         });

   
//         conn.query('UPDATE user SET userid="12345" WHERE userid="a6d1ac";', function(err, results, fields) {
//             // console.log(results);
//         });

//         //
      
//         console.log('---------------------------------------------------------------')
//         conn.query("SELECT * FROM user;", function(err, results, fields) {
//             console.log(results);
//         });

//         conn.query("SELECT * FROM product;", function(err, results, fields) {
//             console.log(results);
//         });

//     } catch (err) { 
//         console.log('error db: ' + err)
//     }
    
// }

// dbfunctions();
import MySql from './Repository/MySql';
const mySqlDatabase = new MySql('localhost', 'root', 'test', 'password', 3306);



import { InMemoryImpl } from './Repository/InMemoryRepo'
const inMemoryRepo = new InMemoryImpl();

import AlterarPerfil from './UseCases/AlterarPerfil'
import Cryptography from './Services/Cryptography'

import InputAlterarPerfilDTO from './DTO/input/AlterarPerfil'
app.post('/alterarPerfil', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => {
    const { name, city, password, gender, birthDate, aboutMe, bio, image } = req.body
    if (!name || !city || !password || !gender || !birthDate) return res.send('empty field');
    const inputData = new InputAlterarPerfilDTO(name, password, gender, city, birthDate, aboutMe, bio, image );
    
    const token = await res.locals.userInfo;

    
    
    const cryptography = new Cryptography(inputData.password);
    
    const alterarPerfil = new AlterarPerfil(inMemoryRepo, cryptography);
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
    const inputData = new InputCriarProdutoDTO(token.id, name, description, image);
    
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
    const { name, email, password, gender, city, birthDate } = req.body
    if (!name || !city || !email || !password || !gender || !birthDate) return res.send('empty field');
   
    
    const inputData = new InputCadastrarDTO(name,email, password, gender,city, birthDate);

  

    const uuid = new UUIDLibrary();
    const cryptography = new Cryptography(inputData.password);

    const cadastrar = new Cadastrar(mySqlDatabase, uuid, cryptography);
    const outputData = await cadastrar.execute(inputData);
    
    return res.json(outputData);
})

app.get('/get', (req, res) => { 
    return res.json(inMemoryRepo.getAllUsers());
})

import InputLogarDTO from './DTO/input/logar';
import Logar from './UseCases/Logar';

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


async function ProtectionAgainstAuthenticatedUsers (req: Request, res: Response, next: NextFunction) {
    const tokenSent = req.headers['authorization']
    if (!tokenSent) return next();
    const authentication = new Authentication();
    const userTokenFormated = authentication.validateToken(tokenSent);
    if (!userTokenFormated) return next();
    const outputData = new OutputCadastrarDTO("User is already authenticated", 401, true)
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




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ... ${PORT}`))
