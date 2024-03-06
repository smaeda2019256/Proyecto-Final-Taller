import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

export const validateJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "There is NO TOKEN in the request"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if(!user){
            return res.status(401).json({
                msg: 'TOKEN is NOT VALID - The user does NOT EXIST in the Database'
            })
        }

        if(!user.estado){
            return res.status(401).json({
                msg: 'TOKEN is NOT VALID or the User have state: FALSE'
            })
        }

        req.user = user;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "TOKEN is NOT VALID",
        });   
    }
};