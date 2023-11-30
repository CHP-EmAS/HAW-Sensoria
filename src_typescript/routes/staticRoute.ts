import express,  { Router, Request, Response} from "express";
import path from "path";

const router = Router();

router.use('/css', express.static('static/css'));
router.use('/fonts', express.static('static/fonts'));
router.use('/script', express.static('static/script'));
router.use('/img', express.static('static/images'));

router.use("/", express.static("static/html/index.html"));

export default router;