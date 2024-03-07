import { Router } from "express";
import { check } from "express-validator";
import { getUsers, postUser, putUser, deleteUser } from "./user.controlador.js";
import { isRoleValid, existsEmail, existsUserById } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { hasRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get('/', getUsers);

router.post('/',
    [
        check('name', 'The name ir required').not().isEmpty(),
        check('password', 'The password must be more than 6 digits long').isLength( { min: 6 } ),
        check('email', 'The email is not valid').isEmail(),
        check('email').custom( existsEmail ),
        validarCampos,
    ], postUser
);

router.put('/:id',
    [
        check('id', 'Not a valid ID').isMongoId(),
        check('id').custom( existsUserById ),
        check('rol').custom( isRoleValid ),
        validarCampos
    ], putUser
);

router.delete('/:id',
    [
        validateJWT,
        hasRole('ADMIN_ROLE', 'COORDINATION_ROLE'),
        check('id', 'Not a valid ID').isMongoId(),
        check('id').custom( existsUserById ),
        validarCampos
    ], deleteUser
);

export default router;