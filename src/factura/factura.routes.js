import { Router } from 'express';
import { check } from 'express-validator';
import { getFacturasUsuarioEspecifico, getFacturas, postFactura } from './factura.controller.js';
import { validateJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { isAdminRole, isClientRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get('/',[
    validateJWT,
    isAdminRole,
    validarCampos
], getFacturas );

router.get('/client',[
    validateJWT,
    isClientRole,
    validarCampos
], getFacturas );

router.get('/:userId', [
    validateJWT,
    isAdminRole,
    validarCampos
], getFacturasUsuarioEspecifico);

router.post('/:id', [
    validateJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    validarCampos
] ,postFactura);


export default router;