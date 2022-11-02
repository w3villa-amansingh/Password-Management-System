const express = require("express");
var passcatModel = require("../modules/passwordCategory");
const router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.delete("/",(req, res,next) => {
    var id=req.body.id;
  passcatModel.findByIdAndRemove(id,(err,data)=>{
      if(err)throw err;
      res.send(' update Node js api');
    
     })
  })
    
    

  
  module.exports=router; 