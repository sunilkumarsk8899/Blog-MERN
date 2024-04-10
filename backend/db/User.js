const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    phone:String,
    company:{ type:String,default:'-' },
    created_date:{ type: Date, default: Date.now() },
    status: { type:Boolean,default:true },
    role: { type:String,default:'user' }
});

module.exports = mongoose.model("users",userSchema);