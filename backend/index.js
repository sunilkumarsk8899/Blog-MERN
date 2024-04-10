const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(express.json());
app.use(cors());


require('./db/Config');

const jwtToken = require('jsonwebtoken');
const secretKey = 'blog-db';
// const verfiyToken = require('./middleware/VerifyToken');

const User = require('./db/User');
// const generateAccessToken = require('./middleware/GenerateAccessToken');




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
                resp.send({ 'msg' : 'Login Faild', 'token' : '', 'userData' : '', 'status' : 404 });
            }else{
                resp.send({ 'msg' : 'Login Successfully', 'token' : token, 'userData' : result, 'status' : 200 });
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
        respData = { 'msg' : 'This Email Already Taken...', 'status' : 200,'data':checkExist }
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
    


app.listen(PORT,()=>{
    console.log('backend port running on '+PORT);
});

