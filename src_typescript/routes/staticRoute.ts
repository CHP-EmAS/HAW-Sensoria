import express,  { Router, Request, Response} from "express";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/../../static/html/index.html'));
});

export default router;