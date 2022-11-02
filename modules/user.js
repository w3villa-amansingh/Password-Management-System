const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pms");
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
  username: { type: String },

  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

var userModel = mongoose.model("users", userSchema);
module.exports = userModel;
