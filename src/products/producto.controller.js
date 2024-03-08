import { response, request } from 'express';
import Producto from './producto.model.js';

export const getProducts = async (req = request, res = response) => {
    const query = { estado: true };

    const listaProducts = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
           .populate('user', 'email')
           .populate('category', 'name')
    ]);
    
    res.json({
        msg: 'List of ACTIVE PRODUCTS',
        listaProducts
    });

}