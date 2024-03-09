import { Router } from 'express';
import { check } from 'express-validator';
import { getFacturaPorId, getFacturas, postFactura } from './factura.controller.js';
import { validateJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existsFacturaById } from '../helpers/db-validators.js';

const router = Router();

router.get('/',[
    validateJWT,
    validarCampos
], getFacturas );


router.get('/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existsFacturaById ),
    validarCampos
], getFacturaPorId );

router.post('/:id', [
    validateJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    validarCampos
] ,postFactura);


export default router;