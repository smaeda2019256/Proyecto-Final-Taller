import bcrypt from 'bcrypt';
import User from '../users/user.model.js';
import { generateJWT } from '../helpers/generar-jwt.js';

export const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'User or password does NOT EXIST - Email does NOT EXIST'
            });
        }

        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'User or password does NOT EXIST - State: FALSE'
            });
        }
        
        const validarPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'User or password does NOT EXIST - PASSWORD INCORRECT'
            });
        }

        const token = await generateJWT( usuario.id, usuario.name, usuario.cart );
        
        res.json({
            msg: 'Welcome! - Your LOGIN was successful!',
            email, password,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contact administrator'
        });
    }



}