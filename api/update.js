const express = require("express");
var passcatModel = require("../modules/passwordCategory");
const router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.put("/:id",(req, res,next) => {
    var id=req.params.id;
    var passCategory=req.body.pass_cat;
    
  passcatModel.findById(id,(err,data)=>{
    
     data.password=passCategory?passCategory:data.passCategory;
     data.save((err)=>{
      if(err)throw err;
      res.send(' update Node js api');
    
     })
  })
    // var passValue=req.body.pass_cat;
    // var passCatDetails= new passcatModel({password:passValue})
    // passCatDetails.save((err,data)=>{
    //     if(err) throw err;
        // res.send('Node js api');
    // })
    
    

  });
  module.exports=router; 