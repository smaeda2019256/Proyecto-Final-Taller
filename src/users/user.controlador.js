import { response, request } from 'express';
import User from './user.model.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req = request, res = response) => {
    const query = {estado: true};

    const listaUsers = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.status(200).json({
        msg: 'AGGREGATED Users',
        listaUsers
    });
}

export const postUser = async (req, res) => {
    const {name, email, password, rol} = req.body;
    const userNew = new User({name, email, password, rol});

    const salt = bcrypt.genSaltSync();
    userNew.password = bcrypt.hashSync(password, salt);

    await userNew.save();

    res.status(200).json({
        msg: 'User ADDED successfully',
        userNew
    });
}

export const putUser = async (req = request, res = response) => {
    const {id} = req.params;
    const {_id, estado, ...resto} = req.body;

    if(resto.password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const userEdit = await User.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'User UPDATED successfully',
        userEdit
    });
}