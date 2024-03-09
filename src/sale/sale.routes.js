import { Router } from "express";
import { check } from "express-validator";
import {validateJWT} from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { salePost } from "./sale.controller.js";
import { isClientRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/", [
        validateJWT,
        isClientRole,
        check("product", "The product is obligatory").not().isEmpty(),
        check("cantidad", "The amount is obligatory").isInt({
            min: 1
        }),
        validarCampos,
    ],
    salePost
);


export default router;
