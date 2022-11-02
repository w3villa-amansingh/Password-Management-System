const express = require("express");
var cors = require("cors");
const port = 3000;
const app = express();
// ==============================
const emailValidator = require('deep-email-validator');
async function isEmailValid(email) {
  return emailValidator.validate(email)
}
var users = require("./api/getcategory");
app.use("/api/getcategory",users);
var passcatModel = require("./modules/passwordCategory");
app.use("/modules/passwordCategory",passcatModel)
var user = require("./api/add_category");
app.use("/api/add_category",user);
var use = require("./api/update");
app.use("/api/update",use);
var us = require("./api/delete");
app.use("/api/delete",us);

// =============================
var passModel = require("./modules/addPassword");
var passcatModel = require("./modules/passwordCategory");

const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");


var jwt = require("jsonwebtoken");
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem("userToken");
  try {
    jwt.verify(userToken, loginToken);
  } catch (err) {
    res.redirect("/");
  }
  next();
}

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = express.Router();
var userModule = require("./modules/user");

function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkExitemail = userModule.findOne({ email: email });
  checkExitemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render("signup", { msg: "Allredy exits email id" });
    }
    next();
  });
}


app.use(cors());
app.set("view engine", "ejs");
app.set("views", "./public/view");
app.use(express.static(__dirname + "/public"));
app.use(router);

app.get("/", (req, res) => {
  res.render("index", { msg: false });
});

router.get("/signup", (req, res) => {
  res.render("signup", { msg: false });
});

router.post("/",async (req, res, next) => {
  var email = req.body.email;

  var password = req.body.password;
  

 

  


  var checkEmail = userModule.findOne({ email: email });
  
  
  checkEmail.exec((err, data) => {
    if (err){
     throw err;
    
    }
    else if (!data){
      return res.status(401).render("index",{ msg:'The email address ' + req.body.email + ' is not associated with any account. please check and try again!'});
  }
    
    else{
    var getUserID = data._id;

    var getPassword = data.password;

    if (bcrypt.compareSync(password, getPassword)) {
      var token = jwt.sign({ userID: getUserID }, "loginToken");
      localStorage.setItem("userToken", token);
      localStorage.setItem("loginUser", email);
      res.redirect("/dashboard");

      //   res.render("index",{msg:"User Login Successfully"})
    } else {
      res.render("index", { msg: "Invalid Password" });
    }
    }
  });


});

router.post("/signup",  checkEmail, (req, res, next) => {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confpassword = req.body.confpassword;
  if (password != confpassword) {
    res.render("signup", { msg: "password not matched" });
  } else {
    password = bcrypt.hashSync(req.body.password, 10);
    var userDetails = new userModule({
      username: username,
      email: email,
      password: password,
    });
    userDetails.save((err, doc) => {
      if (err) {
        throw err;
      } else {
        res.render("signup", { msg: "successfully" });
      }
    });
  }

});

app.get("/passwordCategory", async(req, res) => {
  var loginUser = localStorage.getItem("loginUser");
  var getPassCat=passcatModel.find({});
  getPassCat.exec((err,data)=>{
    if(err) throw err;
    
      res.render("passwordCategory", { loginUser: loginUser,records:data,success:"" });
    })
});

app.get("/passwordCategory/delete/:id", async (req, res) => {
  var loginUser = await localStorage.getItem("loginUser");
  var passCat_id = req.params.id;

  var passDelete = passcatModel.findByIdAndDelete(passCat_id);
  passDelete.exec((err) => {
    if (err) throw err;

    res.redirect(req.get("referer"));
  });
});


app.get("/passwordCategory/edit/:id", async (req, res) => {
    var loginUser = await localStorage.getItem("loginUser");
    var passCat_id = req.params.id;
  
    var getPassCategory = passcatModel.findById(passCat_id);
    getPassCategory .exec((err,data) => {
      if (err) throw err;
  
      res.render("editPassCategory", { loginUser: loginUser,errors:'',success:'', records: data,id:passCat_id  });
    });
  });

  app.post("/passwordCategory/edit/", async (req, res) => {
    var loginUser = await localStorage.getItem("loginUser");
    var passCat_id = req.body.id;
    var passwordCategory = req.body.passwordCategory;
    var updatePassCat = passcatModel.findByIdAndUpdate(passCat_id,{password:passwordCategory})

    updatePassCat .exec((err,doc) => {
      if (err) throw err;
  
      res.redirect("/passwordCategory");
    });
  });

app.get("/dashboard", (req, res) => {
  var loginUser = localStorage.getItem("loginUser");
  var getAllPassword=passModel.find({});
  var getPassCat=passcatModel.find({});
  passModel.countDocuments({}).exec((err,count)=>{
    passcatModel.countDocuments({}).exec((err,countasscat)=>{    
  res.render('dashboard', {loginUser:loginUser,msg:'',totalPassword:count, totalPassCat:countasscat });
  });
});

  //  res.render("dashboard", { loginUser: loginUser });
});
app.get("/addNewCategory", (req, res) => {
  var loginUser = localStorage.getItem("loginUser");
  
    res.render("addNewCategory", {
        loginUser: loginUser,
        errors: "",
        success: "",
      });
  })
  

app.post(
  "/addNewCategory",
  [
    check("passwordCategory", "Enter Password Category Name").isLength({
      min: 1,
    }),
  ],
  (req, res) => {
    var loginUser = localStorage.getItem("loginUser");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("addNewCategory", {
        loginUser: loginUser,
        errors: errors.mapped(),
        success: "",
      });
    } else {
      var passCatName = req.body.passwordCategory;
      var passCatDetails = new passcatModel({
        password: passCatName,
      });
      passCatDetails.save((err, doc) => {
        if (err) throw err;
        res.render("addNewCategory", {
          loginUser: loginUser,
          errors: "",
          success: "password category inserted successfully",
        });
      });
    }
  }
);

app.post("/addNewPassword", (req, res) => {
    var loginUser = localStorage.getItem("loginUser");
    var pass_cat=req.body.pass_cat;
    var passwordDetails=req.body.passwordDetails;
    var passwordDetails=new passModel ({
        password_category :pass_cat,
        passwordDetails :passwordDetails
    });
    passwordDetails.save((err,doc)=>{  
    var getPassCat=passcatModel.find({});
    getPassCat.exec((err,data)=>{
      if(err) throw err;
      
        res.render("addNewPassword", { loginUser: loginUser,records:data,success: "Password Inserted Successfully" });
      })
      
    })
    
    
  });

app.get("/addNewPassword", (req, res) => {
  var loginUser = localStorage.getItem("loginUser");
  var getPassCat=passcatModel.find({});
  getPassCat.exec((err,data)=>{
    if(err) throw err;
    res.render("addNewPassword", { loginUser: loginUser,records:data , success:""});
  })
  
  
});
app.get("/viewAllPassword", (req, res) => {
  var loginUser = localStorage.getItem("loginUser");
  var getAllPassword=passModel.find({});
  getAllPassword.exec((err,data)=>{
    if(err)throw err;
    res.render("viewAllPassword", { loginUser: loginUser,records:data });
  })
});

app.get("/viewAllPassword/delete/:id", async (req, res) => {
    var loginUser = await localStorage.getItem("loginUser");
    var passCat_id = req.params.id;
  
    var passDelete = passModel.findByIdAndDelete(passCat_id);
    passDelete.exec((err) => {
      if (err) throw err;
  
      res.redirect(req.get("referer"));
    });
  });

  app.get("/viewAllPassword/edit/:id", async (req, res) => {
    var loginUser = await localStorage.getItem("loginUser");
    var passCat_id = req.params.id;
  
    var getPassCategory = passModel.findById(passCat_id);
    getPassCategory .exec((err,data) => {
      if (err) throw err;
  
      res.render("editPassword", { loginUser: loginUser,errors:'',success:'', records: data,id:passCat_id  });
    });
  });

  app.post("/viewAllPassword/edit/", async (req, res) => {
    var loginUser = await localStorage.getItem("loginUser");
    var passCat_id = req.body.id;
    var password = req.body.password;
    var updatePassword = passModel.findByIdAndUpdate(passCat_id,{passwordDetails:password})

    updatePassword .exec((err,doc) => {
      if (err) throw err;
  
      res.redirect("/viewAllPassword");
    });
  });

app.get("/logout", (req, res) => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("loginUser");
  res.redirect("/");
});

app.listen(port, (err) => {
  if (err) throw err;
  else console.log("Server is running at port %d:", port);
});
