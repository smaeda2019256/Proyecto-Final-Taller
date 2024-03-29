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

export const isClientRole = (req = request, res = response, next) => {
    if(!req.user) {
        return res.status(500).json({
            msg: 'It is required to verify the ROLE without validating the TOKEN first'
        });
    }

    const {rol, name} = req.user;

    if(rol !== 'CLIENTE_ROLE'){
        return res.status(500).json({
            msg: `${name} is not CLIENT - Does not have ACCESS to this function`
        });
    }

    next();
}

export const hasRole = (...roles) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(500).json({
                msg: 'It is required to verify the ROLE without validating the TOKEN first'
            });
        } 

        if(!roles.includes(req.user.rol)) {
            return res.status(401).json({
                msg: `The service requires one of the following roles: ${roles}`
            })
        }

        next();
    }
}