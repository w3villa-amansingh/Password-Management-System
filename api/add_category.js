const express = require("express");
const router = express.Router();

router.post("/",(req, res,next) => {
    var passValue=req.body.passwordCategory;
    var passCatDetails= new passcatModel({password:passValue})
    passCatDetails.save((err,data)=>{
        if(err) throw err;
        res.send('Node js api');
    })
}) 
module.exports=router; 