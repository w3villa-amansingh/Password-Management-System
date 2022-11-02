var  mysql= require("mysql");
var con= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"w3villa",
    database:"passwordManagementSystem",
    port:3306
})
 con.connect((err)=>{
    if(err)
    {
        throw err;
    }
    else{
        console.log("connection established");
    }
 });