import express,  { Router, Request, Response} from "express";
import path from "path";

const router = Router();

router.use('/Build', express.static('static/build'));

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/../../static/html/index.html'));
});

export default router;