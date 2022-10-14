import 'dotenv/config'
import express, {Request, Response, NextFunction} from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('hi2')

import { InMemoryImpl } from './Repository/MySql'
const inMemoryRepo = new InMemoryImpl();

import AlterarPerfil from './UseCases/AlterarPerfil'
import Cryptography from './Services/Cryptography'

import InputAlterarPerfilDTO from './DTO/input/AlterarPerfil'
app.post('/alterarPerfil', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => {
    const { name, city, email, password, gender, birthDate, aboutMe, bio, image } = req.body
    if (!name || !city || !email || !password || !gender || !birthDate) return res.send('empty field');
    const inputData = new InputAlterarPerfilDTO(name, email, password, gender, city, birthDate, aboutMe, bio, image );
    const tokenEmail = await res.locals.userInfo?.email;
    
    
    const cryptography = new Cryptography(inputData.password);
    
    const alterarPerfil = new AlterarPerfil(inMemoryRepo, cryptography);
    const outputData = await alterarPerfil.execute(tokenEmail, inputData);
    return res.json(outputData);
   
})


import InputCadastrarDTO from './DTO/input/cadastrar'
import Cadastrar from './UseCases/Cadastrar'
import MySql from './Repository/MySql'

import { UUIDLibrary } from './Services/IdGenerator'

import OutputCadastrarDTO from './DTO/output/cadastrar'
import Authentication from './Services/Authentication';



app.post('/cadastrar',ProtectionAgainstAuthenticatedUsers, async (req: Request, res: Response) => {
    const { name, email, password, gender, city, birthDate } = req.body
    if (!name || !city || !email || !password || !gender || !birthDate) return res.send('empty field');
   
    
    const inputData = new InputCadastrarDTO(name,email, password, gender,city, birthDate);

    const mySql = new MySql();
  

    const uuid = new UUIDLibrary();
    const cryptography = new Cryptography(inputData.password);

    const cadastrar = new Cadastrar(inMemoryRepo, uuid, cryptography);
    const outputData = await cadastrar.execute(inputData);
    
    return res.json(outputData);
})

app.get('/get', (req, res) => { 
    return res.json(inMemoryRepo.getAll());
})

import InputLogarDTO from './DTO/input/logar';
import Logar from './UseCases/Logar';

app.post('/login', ProtectionAgainstAuthenticatedUsers, async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) return res.send('error')
    const inputData = new InputLogarDTO(email, password);

    const mySql = new MySql();
    const authentication = new Authentication();
    const cryptography = new Cryptography(inputData.password);

    const logar = new Logar(inMemoryRepo, cryptography, authentication);
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
app.listen(PORT, () => console.log(`Listening on ... ${PORT}`))
