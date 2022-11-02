const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms' );
var conn =mongoose.Collection;
var passcatSchema =new mongoose.Schema({
    password: {type:String, 
             require:true  
        },

	
    password: {
        type:String, 
        required: true
    },
    date:{
        type: Date, 
        default: Date.now }
});

var passcatModel = mongoose.model('passwordCategory', passcatSchema);
module.exports=passcatModel;