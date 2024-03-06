import User from '../users/user.model.js';
import Role from '../users/role.js';

export const isRoleValid = async (rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol) {
        throw new Error(`The role: ${ role } is not registered in the DB`);
    }
}

export const existsEmail = async (email = '') => {
    const existeEmail = await User.findOne({email});
    if(existeEmail) {
        throw new Error(`The email: ${email} already exists and is registered in the DB`);
    }
}

export const existsUserById = async (id) => {
    const existeUser = await User.findById(id);
    if(!existeUser) {
        throw new Error(`The id: ${ id } does not exist in DB`);
    }
}