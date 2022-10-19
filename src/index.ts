import 'dotenv/config'
import express from 'express';
import cors from 'cors'

import { controllers } from './controllers/index'
import { ProtectionAgainstAuthenticatedUsers, ProtectionAgainstNonAuthenticatedUsers } from './middlewares/AuthMiddleware';
import MySql from './Repository/MySql'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

export const mySqlDatabase = new MySql('localhost', 'root', 'test', 'password', 3306);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
import path from 'path'
app.use(express.static(path.join(__dirname + '/views')));


app.get('/pagecadastrar',(req, res) => { 
    res.render("cadastrar");
})

app.get('/pagelogin',(req, res) => { 
    res.render("login");
})

app.get('/pagehome',(req, res) => { 
    res.render("home");
})

app.get('/pagealterarusuario', (req, res) => {
    console.log(res.locals.userInfo)
    res.render("alterarperfil", {data: "hello"});
})

app.get('/pagecriarproduto',(req, res) => { 
    res.render("criarproduto");
})




// User routes
app.post('/loginuser', ProtectionAgainstAuthenticatedUsers, controllers.logarUser)
app.post('/registeruser', ProtectionAgainstAuthenticatedUsers, controllers.registerUser)
app.post('/alteraruser', ProtectionAgainstNonAuthenticatedUsers,controllers.alterarUser )
app.post('/deleteuser', ProtectionAgainstNonAuthenticatedUsers, controllers.deletarUser)
app.get('/get/:procurarnadescricao/:nomeprodutor', controllers.acharUsuariosPorNome)

//Produto routes
app.post('/criarProduto', ProtectionAgainstNonAuthenticatedUsers, controllers.criarProduto )
app.post('deletarProduto', ProtectionAgainstNonAuthenticatedUsers, controllers.deletarProduto)
app.get('/getproduto/:procurarnadescricao/:nomeproduto', controllers.getProdutos)



// app.get('/getprodutosfromUser/:idprodutor', async (req, res) => {
//     const idprodutor = req.params.idprodutor.toString().toLowerCase();
//     const productFound = await mySqlDatabase.findProductsFromUser(idprodutor);
//     return res.json(productFound);
// })

app.post('')

app.get('/auth', controllers.authValidation)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ... ${PORT}`))


// app.get('/get', async (req, res) => {
//     const allUsers = await mySqlDatabase.getAllUsers();
//     return res.json(allUsers);
// })
