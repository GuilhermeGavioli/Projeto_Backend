"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./controllers/index");
const AuthMiddleware_1 = require("./middlewares/AuthMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
const path_1 = __importDefault(require("path"));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/test')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/home')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/alterarUsuario')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/login')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/registrar')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/criarProduto')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/profile2')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/test2')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/procurarproduto')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/produto')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/404Error')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/file_system')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/file_system/app')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/file_system/user')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/file_system/products')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/procurarUsuario')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/assets')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/globals')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/404Error')));
app.use(express_1.default.static(path_1.default.join(__dirname + '/views' + '/acharProdutos')));
app.get('/pagetest/:palavra', (req, res) => {
    res.render(path_1.default.join("acharProdutos", "acharProdutos"));
});
//file System routes to access images from users and products//
app.get('/file_system/user/:filename', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'file_system', 'user', req.params.filename));
});
app.get('/file_system/app/:filename', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'file_system', 'app', req.params.filename));
});
app.get('/file_system/product/:filename', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'file_system', 'product', req.params.filename));
});
// app.get('/test2/:idprodutor', controllers.acharUsuarioPorId)
app.get('/test2/:idprodutor', (req, res) => {
    res.render(path_1.default.join("test2", "test2"));
});
app.get('/procurarproduto', (req, res) => {
    res.render(path_1.default.join("procurarproduto", "procurarproduto"));
});
app.get('/registrar', (req, res) => {
    res.render(path_1.default.join("registrar", "registrar"));
});
app.get('/login', (req, res) => {
    res.render(path_1.default.join("login", "login"));
});
app.get('/profile/:idprodutor', index_1.controllers.acharUsuarioPorId);
app.get('/produto/:idProduto', index_1.controllers.acharProdutoPorId);
app.get('/', (req, res) => {
    res.render(path_1.default.join("home", "home"));
});
app.get('/meuPerfil', (req, res) => {
    res.render(path_1.default.join("alterarUsuario", "alterarperfil"));
});
app.get('/estacaoDeCriacao', (req, res) => {
    res.render(path_1.default.join("criarProduto", "criarProduto"));
});
app.get('/procurarUsuario', (req, res) => {
    res.render(path_1.default.join("procurarUsuario", "procurarUsuario"));
});
const multer_1 = require("./multer");
app.post('/alterarUsuario', multer_1.uploadUser.single("files"), index_1.controllers.updateUser);
app.post('/criarProduto', multer_1.uploadProduct.single("productFile"), index_1.controllers.createProduct);
// User routes
app.post('/loginuser', AuthMiddleware_1.ProtectionAgainstAuthenticatedUsers, index_1.controllers.logarUser);
app.post('/registeruser', AuthMiddleware_1.ProtectionAgainstAuthenticatedUsers, index_1.controllers.registerUser);
app.post('/deleteuser', AuthMiddleware_1.ProtectionAgainstNonAuthenticatedUsers, index_1.controllers.deletarUser);
app.get('/get/:procurarnadescricao/:nomeprodutor', index_1.controllers.acharUsuariosPorNome); // achar por nome / descricao / usado pelo usuario
//Produto routes
// app.post('/criarProduto', ProtectionAgainstNonAuthenticatedUsers, controllers.criarProduto )
app.post('deletarProduto', AuthMiddleware_1.ProtectionAgainstNonAuthenticatedUsers, index_1.controllers.deletarProduto);
//'/getproduto/:procurarnadescricao/:nomeproduto/:number'
app.get('/getprodutos', index_1.controllers.getProdutos);
app.get('/getprodutosfromuser', index_1.controllers.getProdutosFromUser);
app.get('/auth', index_1.controllers.authValidation);
// app.get('*', function(req, res){
//     res.status(404).send('what???');
//   });
// app.get('/getprodutosfromUser/:idprodutor', async (req, res) => {
//     const idprodutor = req.params.idprodutor.toString().toLowerCase();
//     const productFound = await mySqlDatabase.findProductsFromUser(idprodutor);
//     return res.json(productFound);
// })
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ... ${PORT}`));
// app.get('/get', async (req, res) => {
//     const allUsers = await mySqlDatabase.getAllUsers();
//     return res.json(allUsers);
// })
//Handle errors page
app.use(function (req, res) {
    res.render(path_1.default.join("404Error", "404Error"));
});
