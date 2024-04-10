function generateAccessToken(JwtToke,data,secretKey,expireTime) {
    let GetToken = '';
    JwtToke.sign({data}, secretKey, { expiresIn: `${expireTime}2h` },(err,token)=>{
        if(err){
            GetToken = 'Token generate faild';                
        }else{
            GetToken = `bareer ${token}`;
        }
    });
    return GetToken;
}

module.exports = generateAccessToken();