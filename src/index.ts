import 'dotenv/config'
import express, {Request, Response, NextFunction} from 'express';
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

app.use(express.static(path.join(__dirname + '/views' + '/test')));
app.use(express.static(path.join(__dirname + '/views' + '/home')));
app.use(express.static(path.join(__dirname + '/views' + '/alterarUsuario')));
app.use(express.static(path.join(__dirname + '/views' + '/procurarUsuario')));
app.use(express.static(path.join(__dirname + '/views' + '/login')));
app.use(express.static(path.join(__dirname + '/views' + '/cadastrar')));
app.use(express.static(path.join(__dirname + '/views' + '/criarProduto')));
app.use(express.static(path.join(__dirname + '/views' + '/profile')));


app.use(express.static(path.join(__dirname + '/file_system')));
app.use(express.static(path.join(__dirname + '/file_system/app')));
app.use(express.static(path.join(__dirname + '/file_system/user')));
app.use(express.static(path.join(__dirname + '/file_system/products')));


app.get('/pagecadastrar',(req, res) => { 
    res.render(path.join("cadastrar", "cadastrar"));
})

app.get('/pagetest',(req, res) => { 
    res.render(path.join("test", "test"));
})



app.get('/file_system/user/:filename',(req, res) => { 
    res.sendFile(path.join(__dirname, 'file_system', 'user', req.params.filename))
})

app.get('/file_system/app/:filename',(req, res) => { 
    res.sendFile(path.join(__dirname, 'file_system', 'app', req.params.filename))
})

app.get('/file_system/product/:filename',(req, res) => { 
    res.sendFile(path.join(__dirname, 'file_system', 'product', req.params.filename))
})


app.get('/pagelogin',(req, res) => { 
    res.render(path.join("login", "login"));
})

// app.get('/get/:idprodutor', controllers.acharUsuarioPorId) // achar por id //
app.get('/pageprofile/:idprodutor', controllers.acharUsuarioPorId);

app.get('/pagehome',(req, res) => { 
    res.render(path.join("home", "home"));
})

app.get('/pagealterarusuario', (req, res) => {
    res.render(path.join("alterarUsuario", "alterarperfil"));
})

app.get('/pagecriarproduto',(req, res) => { 
    res.render(path.join("criarProduto", "criarProduto"));
})

app.get('/pageprocurarusuario',(req, res) => { 
    res.render(path.join("procurarUsuario", "procurarUsuario"));
})




import { uploadUser, uploadProduct } from './multer'



app.post('/testimage', uploadUser.single("files"), controllers.alterarUserWithImageTest)

app.post('/testimagecriarproduto', uploadProduct.single("productFile"), controllers.criarProdutoWithImageTeste)









// User routes
app.post('/loginuser', ProtectionAgainstAuthenticatedUsers, controllers.logarUser)
app.post('/registeruser', ProtectionAgainstAuthenticatedUsers, controllers.registerUser)
app.post('/alteraruser', ProtectionAgainstNonAuthenticatedUsers,controllers.alterarUser )
app.post('/deleteuser', ProtectionAgainstNonAuthenticatedUsers, controllers.deletarUser)
app.get('/get/:procurarnadescricao/:nomeprodutor', controllers.acharUsuariosPorNome) // achar por nome / descricao / usado pelo usuario

//Produto routes
app.post('/criarProduto', ProtectionAgainstNonAuthenticatedUsers, controllers.criarProduto )
app.post('deletarProduto', ProtectionAgainstNonAuthenticatedUsers, controllers.deletarProduto)
app.get('/getproduto/:procurarnadescricao/:nomeproduto', controllers.getProdutos)

app.get('/getprodutosfromuser/:produtorId', controllers.getProdutosFromUser)



// app.get('/getprodutosfromUser/:idprodutor', async (req, res) => {
//     const idprodutor = req.params.idprodutor.toString().toLowerCase();
//     const productFound = await mySqlDatabase.findProductsFromUser(idprodutor);
//     return res.json(productFound);
// })



app.get('/auth', controllers.authValidation)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ... ${PORT}`))


// app.get('/get', async (req, res) => {
//     const allUsers = await mySqlDatabase.getAllUsers();
//     return res.json(allUsers);
// })
