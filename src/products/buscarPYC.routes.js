import { Router } from "express";
import { search } from "./buscarPYC.controller.js";
import { getProductosMasVendidos } from "./buscarPYC.controller.js";

const router = Router();

router.get('/productos-mas-vendidos', getProductosMasVendidos);
router.get('/:colection/:termino', search);




export default router;