import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { isAdminRole } from "../middlewares/validar-roles.js";
import { postProducts, getProducts, getProductById, deleteProducto, putProduct } from "./producto.controller.js";
import { existProductById } from "../helpers/db-validators.js";

const router = Router();

router.get('/', getProducts );

router.post('/', [
    validateJWT,
    isAdminRole,
    check('name', 'The name is required').not().isEmpty(),
    validarCampos
], postProducts);

router.put('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a Valid ID').isMongoId(),
    check('name', 'The name is required').not().isEmpty(),
    check('id').custom( existProductById ),
    validarCampos
], putProduct);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a Valid ID').isMongoId(),
    check('id').custom( existProductById ),
    validarCampos
], deleteProducto);

export default router;