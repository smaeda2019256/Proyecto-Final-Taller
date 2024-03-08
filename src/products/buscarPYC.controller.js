import { request, response } from "express";
import { ObjectId } from "mongoose";
import Product from './producto.model.js';
import Category from '../category/categoria.model.js';

export const colectionsPerm = [
    'users', 'categories', 'products', 'roles'
];

export const searchProduct = async(termino='', res) => {
    const isID = ObjectId.isValid(termino);

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
        results: products
    });
}

export const searchForCategory = async (termino='', res) => {
    const query = {name: termino.toUpperCase()};
    const categoryFound = await Category.findOne(query);
    const product = await Product.find({category: categoryFound.id});

    return res.json({
        product
    })
}

