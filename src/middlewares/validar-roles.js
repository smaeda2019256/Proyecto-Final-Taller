import { request, response } from "express";


export const isAdminRole = (req = request, res = response, next) => {
    if(!req.user) {
        return res.status(500).json({
            msg: 'It is required to verify the ROLE without validating the TOKEN first'
        });
    }

    const {rol, name} = req.user;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(500).json({
            msg: `${name} is not ADMIN - Does not have ACCESS to this function`
        });
    }

    next();
}
