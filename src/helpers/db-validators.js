import User from '../users/user.model.js';
import Role from '../users/role.js';
import Producto from '../products/producto.model.js';

export const isRoleValid = async (rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol) {
        throw new Error(`The role: ${ rol } is not registered in the DB`);
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

export const existProductById = async(id) => {
    const existeProducto = await Producto.findById(id);

    if ( !existeProducto ) {
        throw new Error(`The Product with id: ${ id } does not exist in DB`);
    }
}