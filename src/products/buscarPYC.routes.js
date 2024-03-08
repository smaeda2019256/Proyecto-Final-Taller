import { Router } from "express";
import { search } from "./buscarPYC.controller.js";

const router = Router();

router.get('/:colection/:termino', search);


export default router;