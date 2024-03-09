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

export const postUserClient = async (req, res) => {
    const {name, email, password} = req.body;
    const userClient = new User({name, email, password});

    const salt = bcrypt.genSaltSync();
    userClient.password = bcrypt.hashSync(password, salt);

    await userClient.save();

    res.status(200).json({
        msg: 'User Client ADDED successfully',
        userClient
    });
}

export const putUserClient = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, estado, ...resto } = req.body;

    if (!req.user || !_id || _id.toString() !== req.user.id.toString()) {
        return res.status(401).json({
            msg: 'You do not have permission to update this user'
        });
    }

    if (resto.password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    try {
        const userEdit = await User.findByIdAndUpdate(id, resto);

        res.status(200).json({
            msg: 'User updated successfully',
            userEdit
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
}




export const deleteUserClient = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { _id: userId, rol } = req.user;

        if (rol !== 'CLIENTE_ROLE' || userId !== id) {
            return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
        }

        // Eliminar el usuario
        const userDel = await User.findByIdAndUpdate(id, { estado: false });

        res.status(200).json({
            msg: 'Usuario eliminado correctamente',
            userDel
        });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el usuario' });
    }
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

export const deleteUser = async (req = request, res = response) => {
    const { id } = req.params;

    const userDel = await User.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'User DELETED successfully',
        userDel
    });
}
