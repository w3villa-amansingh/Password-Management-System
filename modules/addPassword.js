const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms' );
var conn =mongoose.Collection;
var passSchema =new mongoose.Schema({
    password: {type:String, 
             require:true  
        },

	
        passwordDetail: {type:String, 
            require:true  
       },
    date:{
        type: Date, 
        default: Date.now }
});

var passModel = mongoose.model('passwordDetails', passSchema);
module.exports=passModel;