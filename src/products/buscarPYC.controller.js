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