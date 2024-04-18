const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name:String,
    user_id:String,
    status:{ type:Boolean,default:true }
});
module.exports = mongoose.model("tbl_categorys",categorySchema);