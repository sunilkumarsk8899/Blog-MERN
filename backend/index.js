const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(express.json());
app.use(cors());

require('./db/Config');

const jwtToken = require('jsonwebtoken');
const secretKey = 'blog-db';

/**
 * db
 */
const User = require('./db/User');
const Category = require('./db/Category');
const Post = require('./db/Post');



/**
 * user login
 */
app.post('/api/user/login', async (req,resp)=>{
    const LoginData = {
        email    : req.body.email,
        password : req.body.password
    }
    let result = await User.findOne(LoginData).select('-password');
    if(result){
        jwtToken.sign({result}, secretKey, { expiresIn: "2h" },(err,token)=>{
            if(err){
                resp.send({ 'msg' : 'Login Faild', 'token' : '', 'userData' : '', 'status' : 500 });
            }else{
                resp.send({ 'msg' : 'Login Successfully', 'token' : `barrer ${token}`, 'userData' : result, 'status' : 200 });
            }
        });
    }else{
        resp.send({ 'msg' : 'Invaild Credentials', 'token' : '', 'userData' : '', 'status' : 404 });
    }
})

/**
 * user register
 */
app.post('/api/user/register', async (req,resp)=>{
    const UserInsertData = {
        fname       : req.body.first_name,
        lname       : req.body.last_name,
        email       : req.body.email,
        password    : req.body.password,
        phone       : req.body.phone,
        company     : (req.body.company) ? req.body.company : '-',
      }
    
    let status = '';
    let respData = '';

    const checkExist = await User.find({ email : req.body.email });
    if(checkExist.length > 0){ // check already exist or not
        status = 200;
        respData = { 'msg' : 'This Email Already Taken...', 'status' : 404,'data':checkExist }
    }else{
        if(UserInsertData == ''){ // fields required
            status = 404;
            respData = { 'msg':'All Field Is Required','status':404,'data':UserInsertData };
        }else{ // insert record
            let newUser = new User(UserInsertData);
            let result = await newUser.save();
            status = 200;
            respData = { 'msg':'Register Successfully','data':result,'status':200 };
        }
    }

    resp.status(status).send(respData); 
});


/**
 * get profile data
 */
app.get('/api/get-profile-data/:userID', verifyToken, async (req,resp)=>{
    let result = await User.findOne({ _id : req.params.userID });
    if(result){
        resp.send({ 'msg' : 'User Found', 'data' : result, 'status' : 200 });
    }else{
        resp.send({ 'msg' : 'User Not Found', 'data' : '', 'status' : 404 });
    }
});


/**
 * profile update
 */
app.put('/api/profile-update/:id', verifyToken, async (req,resp)=>{
    let result = await User.findOne({ _id : req.params.id });
    if(result){
        let result = await User.updateOne(
            { _id   : req.params.id },
            { $set  : req.body }
        );
        if(result){
            resp.send({ 'msg' : "User Update Successfully", 'status' : 200 });
        }else{
            resp.send({ 'msg' : "Somthing went wrong", 'status' : 500 });
        }
    }else{
        resp.send({ 'msg' : "User Found", 'status' : 404 });
    }
});

/**
 * add category
 */
app.post('/api/category/add', verifyToken, async (req,resp)=>{
    if(req.body != ''){
        let result = await Category.findOne({ name : req.body.category });
        if(result){
            resp.send({ 'msg' : `${req.body.category} Already Exist`, 'status' : 404 });
        }else{
            let insertData = {
                name : req.body.category,
                user_id : req.body.userID
            };
            let newCategory = new Category(insertData);
            let data = await newCategory.save();
            if(data){
                resp.send({ 'msg' : `${req.body.category} Category Add Successfully`, 'status' : 200 });
            }else{
                resp.send({ 'msg' : `${req.body.category} Somthing wen't wrong`, 'status' : 500 });
            }
        }
    }else{
        resp.send({ 'msg' : `All Fields Is Required`, 'status' : 404 });
    }

});


/**
 * get all categorys by user id
 */
app.get('/api/get-categorys/:id', verifyToken, async (req,resp)=>{
    const data = await Category.find({ 'user_id' : req.params.id });
    if(data){
        resp.send({ 'data' : data, 'msg' : 'Found Category Data', 'status' : 200 });
    }else{
        resp.send({ 'data' : '', 'msg' : 'Not Found Category Data', 'status' : 404 });
    }
});


/**
 * all category
 */
app.get('/api/get-categorys', verifyToken, async (req,resp)=>{
    const data = await Category.find();
    if(data){
        resp.send({ 'data' : data, 'msg' : 'Found Category Data', 'status' : 200 });
    }else{
        resp.send({ 'data' : '', 'msg' : 'Not Found Category Data', 'status' : 404 });
    }
});


/**
 * get category by id
 */
app.get('/api/get-single-category/:id', verifyToken, async (req,resp)=>{
    const data = await Category.findOne({ _id : req.params.id });
    if(data){
        resp.send({ 'msg' : 'Found Single Category Data', 'data' : data, 'status' : 200  });
    }else{
        resp.send({ 'msg' : 'Not Found Single Category Data', 'data' : '', 'status' : 404  });
    }
});

/**
 * update category
 */
app.put('/api/update/category/:id', verifyToken, async (req,resp)=>{
    let check = await Category.findOne({ _id : req.params.id });
    if(check){
        let result = await Category.updateOne(
            { _id   : req.params.id },
            { $set  : req.body }
        );
        resp.send({ 'msg' : 'Category Record Update Successfully', 'status' : 200, 'data' : result });
    }else{
        resp.send({ 'msg' : "Somthing wen't wrong!", 'status' : 404 });
    }
});
    

/**
 * category delete
 */
app.get('/api/delete/category/:id', verifyToken, async (req,resp)=>{
    let data = await Category.findOne({ _id : req.params.id });
    if(data){
        let result = await Category.deleteOne({ _id : req.params.id }); 
        if(result){
            resp.send({ 'msg' : 'Delete Successfully', 'status' : 200 , 'data' : result });
        }else{
            resp.send({ 'msg' : 'Delete Successfully', 'status' : 500 });
        }
    }else{
        resp.send({ 'msg' : "Somthing wen't wrong", 'status' : 404 });
    }
});


/**
 * post insert
 */
app.post('/api/post/insert', verifyToken, async (req,resp)=>{
    let check = Post.findOne({ title : req.body.title });
    if(check){
        resp.send({ 'msg' : 'Post Already Exist', 'status' : 500 });
    }else{
        let insertData = {
            title : req.body.title,
            description : req.body.desc,
            cat_id : req.body.cat_id,
            user_id : req.body.user_id,
            published_date : published_date,
            tag : req.body.tag
        };
        let post = new Post(insertData);
        let data = await post.save();
        if(data){
            resp.send({ 'msg' : 'Post Insert Successfully', 'status' : 200 });
        }else{
            resp.send({ 'msg' : 'Post Not Inserted, Somthing went wrong', 'status' : 404 });
        }
    }
});



/**
 * verfiy token
 */
function verifyToken(req, resp, next) {
    let token = req.header('authorization');
    if (!token) return resp.send({ 'msg': `Access denied Token Not Valid`,'token': token });
    token = token.split(" ")[1];
    try {
        jwtToken.verify(token,secretKey,(err,valid)=>{
            if(err){
                resp.status(401).send({'msg' : 'Invalid Token', 'error':err});
            }else{
                next();
            }
        });
     } catch (error) {
        resp.status(401).json({ 'msg': 'Invalid token somthing went wrong', 'status': 404, 'error': error });
     }
};


app.listen(PORT,()=>{
    console.log('backend port running on '+PORT);
});

