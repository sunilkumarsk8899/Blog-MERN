const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title : String,
    description : String,
    image : { type:String,default:'default.png' },
    cat_id : String,
    user_id : String,
    published_date : String,
    tag : String,
    status : { type:Boolean,default:false },
    created_date : { type: Date, default: Date.now() }
});

module.exports = mongoose.model("posts",postSchema);