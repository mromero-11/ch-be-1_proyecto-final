import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import viewsRoutes from './routes/views.routes.js';
import __dirname from './utils.js';

//  server & port
const app = express();
const PORT = 8080;

//  server settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

//  handlebars settings
app.engine("handlebars", handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//  routes
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)
app.use('/products', viewsRoutes)

//  test
app.get('/ping', (req, res) => {
    res.send('pong');
})

//  test
app.get('/ping-handlebars', (req, res) => {
    let ping = {
        msg: "pong"
    }
    res.render("test", ping);
})

//  run http server
const httpServer = app.listen(PORT, () => {
    console.log("server running, listening on port " + PORT);
});

//  run socket server
const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log("socket running");

    //  fetch and send products to clients
    const sendProducts = async () => {
        try {
            const response = await fetch('http://localhost:' + PORT + '/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const products = await response.json();
            
            //  broadcast to all clients
            socketServer.emit('updateProducts', products); 
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    //  listen for requests to fetch products
    socket.on('requestProducts', sendProducts);
});
