const express = require("express");

const router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var passcatModel = require("../modules/passwordCategory");
router.get("/",(req, res,next) => {
    var getPassCat=passcatModel.find({},{'password':1,_id:1});
    getPassCat.exec((err,data)=>{
      if(err) throw err;
      res.send('Node js api\n ' + data);
    })

  });
  router.post("/add_category",(req, res,next) => {
    var passValue=req.body.pass_cat;
    var passCatDetails= new passcatModel({password:passValue})
    passCatDetails.save((err,data)=>{
        if(err) throw err;
        res.send('Node js api');
    })
    
    

  });
  module.exports=router; 
  