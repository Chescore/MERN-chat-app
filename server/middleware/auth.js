const jwt = require('jsonwebtoken');

module.exports = async (req,res,next) => {
    try{
        if(!req.headers.authorization) return res.status(401).send("Unauthorized user")
        const token = req.headers.authorization.split(" ")[1];
        if(!token) return res.status(401).json({message: 'Unauthorized',isLoggedIn: false});
        jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err)
                return res.status(401).json({ message: 'Unauthorized', isLoggedIn: false });
            req.user = {};
            req.user = decoded;
            next();
        })
    }catch(err){
        res.status(401).json({message:err.message})
    }
}