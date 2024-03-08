import { request, response } from "express";
import { Types } from "mongoose";
import Product from './producto.model.js';
import Category from '../category/categoria.model.js';

export const colectionsPerm = [
    'users', 'categories', 'products', 'roles'
];

export const searchProduct = async(termino='', res) => {
    const isID = Types.ObjectId.isValid(termino);

    if(isID){
        const product = await Product.findById(termino);
        return res.json({
            results: (product) ? (product) : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const products = await Product.find({
        $or: [{name: regex}],
        $and: [{estado:true}]
    });

    res.json({
        msg: "Product FOUND",
        results: products
    });
}

export const searchForCategory = async (termino='', res) => {
    const query = {name: termino.toUpperCase()};
    const categoryFound = await Category.findOne(query);
    const product = await Product.find({category: categoryFound.id});

    return res.json({
        msg: "Category FOUND",
        product
    })
}

export const search = (req, res) => {
    const {colection, termino} = req.params;

    if(!colectionsPerm.includes(colection)){
        return res.status(400).json({
            msg: `The Colection: ${colection} not exits in the DB
            The permitted collections are: ${colectionsPerm}`
        });
    }

    switch (colection){
        case 'users':
        break;

        case 'categories':
            searchForCategory(termino, res)
        break;

        case 'products':
            searchProduct(termino, res)
        break;
        default:
            res.status(500).json({
                msg: 'Forgot to do this search'
            });
    }
}