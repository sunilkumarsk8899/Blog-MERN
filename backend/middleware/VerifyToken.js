/**
 * token verfiy
 */
function verifyToken(req, res, next) {
    let token = req.header('authorization');
    token = token.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        Jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
                resp.status(401).send({result : 'Invalid Token'});
            }else{
                next();
            }
        });
     } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
     }
};