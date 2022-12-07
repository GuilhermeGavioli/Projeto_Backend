import 'dotenv/config'
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors'

import { controllers } from './controllers/index'
import { ProtectionAgainstAuthenticatedUsers, ProtectionAgainstNonAuthenticatedUsers } from './middlewares/AuthMiddleware';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// const rateLimit = require('express-rate-limit');
import { rateLimit } from 'express-rate-limit';

const loginRateLimiter = rateLimit({
  windowMs: 0.30 * 60 * 1000, // 15 min in milliseconds
  max: 150,
  message: "IP error, voce atingiu o numero maximo de requisiçoes durante o tempo permitido, aguarde 20 segundos", 
  statusCode: 429,
  headers: true,
});

app.use(loginRateLimiter)



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')


import path from 'path'


app.use(express.static(path.join(__dirname + '/views')));

app.use(express.static(path.join(__dirname + '/views' + '/home')));
app.use(express.static(path.join(__dirname + '/views' + '/alterarUsuario')));
app.use(express.static(path.join(__dirname + '/views' + '/login')));
app.use(express.static(path.join(__dirname + '/views' + '/registrar')));
app.use(express.static(path.join(__dirname + '/views' + '/criarProduto')));
app.use(express.static(path.join(__dirname + '/views' + '/meusProdutos')));
app.use(express.static(path.join(__dirname + '/views' + '/profile')));
app.use(express.static(path.join(__dirname + '/views' + '/procurarproduto')));
app.use(express.static(path.join(__dirname + '/views' + '/produto')));
app.use(express.static(path.join(__dirname + '/views' + '/sobre')));
app.use(express.static(path.join(__dirname + '/views' + '/404Error')));
app.use(express.static(path.join(__dirname + '/views' + '/globalChat')));

app.use(express.static(path.join(__dirname + '/views' + '/sobreprodutos')));

app.use(express.static(path.join(__dirname + '/file_system')));
app.use(express.static(path.join(__dirname + '/file_system/app')));
app.use(express.static(path.join(__dirname + '/file_system/user')));
app.use(express.static(path.join(__dirname + '/file_system/products')));


app.use(express.static(path.join(__dirname + '/views' + '/procurarUsuario')));

app.use(express.static(path.join(__dirname + '/views' + '/assets')));
app.use(express.static(path.join(__dirname + '/views' + '/globals')));

app.use(express.static(path.join(__dirname + '/views' + '/404Error')));
app.use(express.static(path.join(__dirname + '/views' + '/acharProdutos')));



//file System routes to access images from users and products//
app.get('/file_system/user/:filename',(req, res) => { 
    res.sendFile(path.join(__dirname, 'file_system', 'user', req.params.filename))
})
app.get('/file_system/app/:filename',(req, res) => { 
    res.sendFile(path.join(__dirname, 'file_system', 'app', req.params.filename))
}) 
app.get('/file_system/product/:filename',(req, res) => { 
    res.sendFile(path.join(__dirname, 'file_system', 'product', req.params.filename))
})

app.get('/globalchat', (req, res) => { 
    res.render(path.join("globalChat", "globalchat"));

})

app.get('/procurarproduto', (req, res) => { 
    res.render(path.join("procurarproduto", "procurarproduto"));
})

app.get('/sobreprodutos', (req, res) => {
    res.render(path.join("sobreprodutos", "sobreprodutos"));
})

app.get('/categorias', (req, res) => { 
    res.render(path.join("categorias", "categorias"));
})

app.get('/registrar',(req, res) => { 
    res.render(path.join("registrar", "registrar"));
})

app.get('/login',(req, res) => { 
    res.render(path.join("login", "login"));
})

app.get('/profile/:idprodutor', controllers.acharUsuarioPorId);

app.get('/produto/:idProduto', controllers.acharProdutoPorId)

app.get('/',(req, res) => {
    res.render(path.join("home", "home"));
})

app.get('/meuPerfil', (req, res) => {
    res.render(path.join("alterarUsuario", "alterarperfil"));
})

app.get('/estacaoDeCriacao',(req, res) => { 
    res.render(path.join("criarProduto", "criarProduto"));
})

app.get('/meusProdutos',(req, res) => { 
    res.render(path.join("meusprodutos", "meusprodutos"));
})

app.get('/procurarUsuario',(req, res) => { 
    res.render(path.join("procurarUsuario", "procurarUsuario"));
})

app.get('/sobre', (req, res) => { 
    res.render(path.join("sobre", "sobre"));
})



import { uploadUser, uploadProduct } from './multer'


app.post('/alterarUsuario', uploadUser.single("files"), controllers.updateUser)
app.post('/criarProduto', uploadProduct.single("productFile"), controllers.createProduct)








import { mySqlDatabase } from './controllers/index';
app.post('/message', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => { 
    const tokenUser = res.locals.userInfo
    const sender = tokenUser.user_id
    const { message, receiver } = req.body
    console.log('sender ' + sender)
    console.log('receiver ' + receiver)
    await mySqlDatabase.saveMessage(sender, message, receiver);
    return res.json({ok : true})
})

app.get('/mymessages', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => { 
    const userTokenId = res.locals.userInfo.user_id
    const messages = await mySqlDatabase.getMessages(userTokenId);
    console.log(messages);
    return res.json(messages);
})

app.post('/readmessage', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => {
    try {
        const {  messages   }  = req.body
        console.log(messages)
        if (!messages) return res.json({ read: false, error: true })
        const userTokenId = res.locals.userInfo.user_id
        messages.map(async (message: any) => { 
            await mySqlDatabase.updateRobotMessage(message?.message_id.toString(), userTokenId);
        })

   
        return res.json({ read: true, error: false });
    } catch (err) {
        console.log(err)
        return res.json({read: false, error: true, error_message: err})
     }
})

export async function notifyUser(receiver: string, message: string) {
    let id = Math.random().toString();
    await mySqlDatabase.sendRobotMessage(id.toString(), receiver, message);

}

app.post('/deletemessages', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => { 
    const userTokenId = res.locals.userInfo.user_id
    console.log('hello here')
    const  selectedMessages  = req.body
    console.log(selectedMessages)
    if (!selectedMessages) return;
    await mySqlDatabase.deleteMessages(userTokenId, selectedMessages);
    return res.json({ok : true});
})

// User routes
app.post('/loginuser', ProtectionAgainstAuthenticatedUsers, controllers.logarUser)
app.post('/registeruser', ProtectionAgainstAuthenticatedUsers, controllers.registerUser)
app.post('/deleteuser', ProtectionAgainstNonAuthenticatedUsers, controllers.deletarUser)
app.get('/get/:procurarnadescricao/:nomeprodutor', controllers.acharUsuariosPorNome) // achar por nome / descricao / usado pelo usuario

//Produto routes
// app.post('/criarProduto', ProtectionAgainstNonAuthenticatedUsers, controllers.criarProduto )
app.post('/deletarProduto/:produtoid', ProtectionAgainstNonAuthenticatedUsers, controllers.deletarProduto)


//'/getproduto/:procurarnadescricao/:nomeproduto/:number'
app.get('/getprodutos', controllers.getProdutos)
app.get('/getprodutosporcategoria', controllers.getProdutosByCategory)
app.get('/getprodutosfromuser',ProtectionAgainstNonAuthenticatedUsers, controllers.getProdutosFromUser)
app.get('/auth', controllers.authValidation)

// app.get('*', function(req, res){
//     res.status(404).send('what???');
//   });


app.post('/avaliarproduto', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => {
    const token_id = res.locals.userInfo.user_id;
    const {p_id, critic} = req.body
     console.log(p_id)
    const rating = await mySqlDatabase.findRatting(p_id, token_id);
    if (rating) return res.json(rating)
    await mySqlDatabase.createRatting(p_id, token_id, critic);
    return res.json({created: true});
})

app.post('/acharavaliacao', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => {
    const token_id = res.locals.userInfo.user_id;
    const {p_id} = req.body
    await mySqlDatabase.findRatting(p_id, token_id);
    return res.json('ok');
})

app.get('/acharavaliacoes/:p_id/:pack', async (req, res) => {
    const { p_id, pack } = req.params
    console.log('pack ' + pack)
    try {
        const ratings = await mySqlDatabase.findRattings(p_id, Number(pack));
        if (!ratings) return res.json(null)
        return res.json(ratings);
    } catch (err) {
        return res.json({fetched: false, erro: true});
     }
})

app.get('/mycartitems',ProtectionAgainstNonAuthenticatedUsers, async (req, res) => { 
    const token_id = res.locals.userInfo.user_id;
    try {
        const carItems = await mySqlDatabase.getCartItemsFromUser(token_id);
        return res.json(carItems);
    } catch (err) {
        console.log(err)
        return res.json({gotten: false, erro: true});
    }
})

app.get('/insertcartitem/:productid', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => { 
    const token_id = res.locals.userInfo.user_id;
    const { productid } = req.params
    try {
        const foundItem = await mySqlDatabase.findOneOnCart(token_id, productid);
        if (foundItem) return res.json({saved: false, message: "Item já está dentro no carrinho"})
        const savedItem = await mySqlDatabase.saveOnCart(token_id, productid);
        return res.json({saved: true, savedItem});
    } catch (err) {   
        console.log(err)
        return res.json({saved: false, erro: true});
    }
})

app.get('/removecartitem/:cart_item_id', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => { 
    const token_id = res.locals.userInfo.user_id;
    const { cart_item_id } = req.params
    try {
        await mySqlDatabase.deleteFromCart(token_id, cart_item_id);
        return res.json({deleted: true});
    } catch (err) {
        console.log(err)
        return res.json({deleted: false, erro: true});
    }
})



app.delete('/deletaravaliacao/:ratting_id', ProtectionAgainstNonAuthenticatedUsers, async (req, res) => {
    const token_id = res.locals.userInfo.user_id;
    const { ratting_id } = req.params
    try {
        await mySqlDatabase.deleteRatting(token_id, ratting_id);
        return res.json({deleted: true});
    } catch (err) {   
        return res.json({deleted: false, erro: true});
    }
})

app.get('/acharprodutoporcategoria/:amount/:category', async (req, res) => { 
    console.log('hellou')
    const { amount, category } = req.params
    console.log(category)
    try {
        if (Number(amount) > 10 || Number(amount) < 1) return res.json({ error: true, message: 'Invalid amount to be fetched' }) 
        const products: any = await mySqlDatabase.findProductByCategory(category, Number(amount));
        if (!products) return res.json({ found: null });
        console.log('prod ' + products)
        return res.json(products);
    } catch (err) {
        console.log(err)
        return res.json({error: true});
    }
})



app.get('/getrandomproducts/:amount', async (req, res) => { 
    const { amount } = req.params
    if (!amount || Number(amount) > 21) return res.json('error')
    try {
        const products: any = await mySqlDatabase.findCertainAmountOfRandomProducts(Number(amount));
        if (!products) return res.json({ found: null });
        return res.json(products);
    } catch (err) {
        console.log(err)
        return res.json({error: true});
    }
})

// app.get('/getprodutosfromUser/:idprodutor', async (req, res) => {
//     const idprodutor = req.params.idprodutor.toString().toLowerCase();
//     const productFound = await mySqlDatabase.findProductsFromUser(idprodutor);
//     return res.json(productFound);
// })

import { Server } from "socket.io";

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

const lastTenGlobalChatMessages: any[] = [

]

let onlineChatUsers: any = []


io.on('connection', socket => { 
    socket.emit('last-ten-messages', lastTenGlobalChatMessages)
    socket.emit('users-already-online', onlineChatUsers)
    
    socket.on('entered', user => { 
        const found = onlineChatUsers.find((savedUser: { id: any; }) => savedUser.id == user.id)
        if (!found) {
            user.s_id = socket.id
            onlineChatUsers.push(user)
            console.log(onlineChatUsers)
            socket.broadcast.emit('someone-joined', user)
        }
    })


    console.log(socket.id)
    socket.on('send-message', message => {
        lastTenGlobalChatMessages.push(message)
        const date = new Date();
        date.setHours(date.getHours() - 3)
        console.log(date)
        message.date = date
        socket.broadcast.emit('send-message-server', message)
    })


    socket.on('disconnect', () => {
        onlineChatUsers.map((user: { id: any, s_id: any }) => {
            console.log(user.s_id + ' ' + socket.id)
            
            
            if (user.s_id == socket.id) {
                console.log('emiting disconnection')
                socket.broadcast.emit('someone-disconnected', user.id)
            }
        })
        onlineChatUsers = onlineChatUsers.filter((user: { s_id: any }) => user.s_id != socket.id)
        console.log(onlineChatUsers)
    })
})






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ... ${PORT}`))


// app.get('/get', async (req, res) => {
//     const allUsers = await mySqlDatabase.getAllUsers();
//     return res.json(allUsers);
// })

//Handle errors page
app.use(function (req, res) {
    res.render(path.join("404Error", "404Error"));
});