import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import viewsRoutes from './routes/views.routes.js';
import __dirname from './utils.js';

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/chbe1';
mongoose.connect(MONGO_URI).then(() => {
    console.log('connected to MongoDB');
}).catch((error) => {
    console.error('error connecting to MongoDB:', error);
});

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
