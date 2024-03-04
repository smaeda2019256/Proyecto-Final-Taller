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
