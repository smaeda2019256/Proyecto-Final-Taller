import User from '../users/user.model.js';
import Role from '../users/role.js';

export const isRoleValid = async (rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol) {
        throw new Error(`The role ${ role } is not registered in the DB`);
    }
}