import { Router } from "express";
import { search } from "./buscarPYC.controller.js";
import { getProductosMasVendidos } from "./buscarPYC.controller.js";
import { isClientRole } from "../middlewares/validar-roles.js";
import { validateJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get('/productos-mas-vendidos', [validateJWT, isClientRole], getProductosMasVendidos);
router.get('/:colection/:termino', [validateJWT, isClientRole], search);




export default router;