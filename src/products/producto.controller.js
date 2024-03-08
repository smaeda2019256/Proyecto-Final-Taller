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

export const getProductById = async (req, res ) => {

    const { id } = req.params;
    const prouductById = await Producto.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');
 
    res.status(201).json( prouductById );
}

export const putProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, user, ...restoData } = req.body;

    if ( restoData.name ) {
        restoData.name = restoData.name.toUpperCase();
        restoData.user = req.user._id;
    }
    const productUpd = await Producto.findByIdAndUpdate(id, restoData, { new: true });

    res.status(201).json({
        msg: 'The Product was UPDATED correctly',
        productUpd
    })

}

