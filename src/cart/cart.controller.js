import { request, response } from "express";
import User from '../users/user.model.js';
import user from '../users/user.model.js';
import Product from '../products/producto.model.js';

export const postCart = async(req, res) => {
    const {itemId} = req.params;

    try{
        const item = await Product.findById(itemId);

        if(!item){
            return res.status(404).json({
                message: "Product NOT IN EXISTENCE"
            });
        }

        const idUser = req.user.id;
        const {cart} = await User.findById(idUser);

        const existsInCart = cart.find((item) => item.itemId === itemId);
        
        if (existsInCart){
            existsInCart.quantity += 1;
            existsInCart.name = item.name;
            existsInCart.precio = item.precio;
        }else {
            cart.push({itemId, quantity: 1});
        }

        await User.findByIdAndUpdate(idUser, {cart});
        return res.status(500).json({
            message: "Product is ADDED to Cart"
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "ERROR | Internal Server"
        });
    }
}

export const getCart = async(req, res) => {
    try{
        const idUser = req.user.id;
        const {cart} = await User.findById(idUser).populate("cart.itemId");
        return res.status(200).json({
            msg: "GET CART",
            cart
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "ERROR | Internal Server"
        });
    }
};

