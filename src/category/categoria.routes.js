import { Router } from "express";
import { check } from "express-validator";
import { postCategory, getCategories, getCategoryById, putCategory, deleteCategory } from "./categoria.controller.js";
import { existsCategoryById } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from "../middlewares/validar-jwt.js";
import { isAdminRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get('/', [validateJWT, isAdminRole], getCategories );

router.get('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a Valid ID').isMongoId(),
    check('id').custom( existsCategoryById ),
    validarCampos
], getCategoryById );


router.post('/', [
    validateJWT,
    isAdminRole,
    check('name', 'The name is required').not().isEmpty(),
    validarCampos
] , postCategory);

router.put('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a Valid ID').isMongoId(),
    check('name', 'The name is required').not().isEmpty(),
    check('id').custom( existsCategoryById ),
    validarCampos
] , putCategory);


router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a Valid IDo').isMongoId(),
    check('id').custom( existsCategoryById ),
    validarCampos
] , deleteCategory);

export default router;