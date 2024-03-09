'use strict'

import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan'; 
import { dbConnection } from "./mongo.js";
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import productRoutes from '../src/products/producto.routes.js';
import categoryRoutes from '../src/category/categoria.routes.js';
import searchRoutes from '../src/products/buscarPYC.routes.js';
import cartRoutes from '../src/cart/cart.routes.js';
import facturaRoutes from '../src/factura/factura.routes.js';
import saleRoutes from '../src/sale/sale.routes.js';

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/pf/v2/users';
        this.authPath = '/pf/v2/auth';
        this.productPath = '/pf/v2/products';
        this.categoryPath = '/pf/v2/categories';
        this.searchPath = '/pf/v2/search';
        this.cartPath = '/pf/v2/cart';
        this.facturaPath = '/pf/v2/factura';
        this.salePath = '/pf/v2/sale';

        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.searchPath, searchRoutes);
        this.app.use(this.cartPath, cartRoutes);
        this.app.use(this.facturaPath, facturaRoutes);
        this.app.use(this.salePath, saleRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server Running on Port: ', this.port);
        });
    }
}

export default Server;