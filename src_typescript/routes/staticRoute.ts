import express,  { Router, Request, Response} from "express";
import fs from "fs";
import path from "path";

const router = Router();

router.use('/Build', express.static('static/build'));
router.use('/TemplateData', express.static('static/templates'));

router.get("/Build/:file", function(req, res) {
    fs.readFile('/../../static/build/' + req.params.file, function(err, data) {
        if(err) {
          res.send("Oops! Couldn't find that file.");
        } else {
          // set the content type based on the file
          res.contentType(req.params.file);
          res.send(data);
        }   
        res.end();
      }); 
});

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/../../static/html/index.html'));
});

export default router;