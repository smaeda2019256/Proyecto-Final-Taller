import { request, response } from "express";
import User from '../users/user.model.js';
import user from '../users/user.model.js';
import Product from '../products/producto.model.js';

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