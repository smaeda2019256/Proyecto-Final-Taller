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
        msg: 'LIST --- AGGREGATED Users',
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

export const getUsersClients = async (req, res) => {
    try {
        const users = await User.find({ rol: 'CLIENTE_ROLE' });

        res.status(200).json({
            msg: 'LIST ---- USERS CLIENTS',
            users
        });
    } catch (error) {
        console.error('Error getting users by role:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const putUserClient = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileId = req.params.id; 
        const { ...updateData } = req.body; 
        
        if (userId !== profileId) {
            return res.status(403).json({ error: 'You do not have permission to update this profile' });
        }

        const updatedProfile = await User.findByIdAndUpdate(profileId, updateData, { new: true });

        res.status(200).json({ message: 'User updated successfully', updatedProfile });
    } catch (error) {
        console.error('Error updating the user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUserClient = async (req, res) => {
    try {
        const userId = req.user.id; 
        const profileId = req.params.id; 

        if (userId !== profileId) {
            return res.status(403).json({ error: 'You do not have permission to delete this profile' });
        }

        const deletedProfile = await User.findByIdAndDelete(profileId);

        res.status(200).json({ message: 'Profile successfully deleted', deletedProfile });
    } catch (error) {
        console.error('Error deleting the user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

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
