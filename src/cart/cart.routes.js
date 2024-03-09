import { Router } from "express";
import { check } from "express-validator";
import { postCart, getCart, putCart, deleteCart } from "./cart.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { isClientRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get('/', [
    validateJWT,
    isClientRole,
] , getCart);

router.post('/:itemId', [
    validateJWT,
    isClientRole,
    check('itemId', 'Not a Valid ID').isMongoId()
], postCart );

router.put('/:itemId', [
    validateJWT,
    isClientRole,
    check('itemId', 'Not a Valid IDo').isMongoId(),
    validarCampos
] , putCart);

router.delete('/:itemId', [
    validateJWT,
    isClientRole,
    check('itemId', 'Not a Valid ID').isMongoId(),
    validarCampos
] , deleteCart);

export default router;