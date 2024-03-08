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
        msg: 'List - ACTIVE PRODUCTS',
        listaProducts
    });

}

export const postProducts = async (req = request, res = response) => {
    const { estado, user, ...body } = req.body;
    const productDB = await Producto.findOne({ name: body.name });

    if (productDB) {
        return res.status(400).json({
            msg: `The Product ${ productDB.name }, already EXISTS in DataBase`
        });
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user.id
    }

    const product = await Producto(data);
    await product.save();

    res.status(201).json(product);
}