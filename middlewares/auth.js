const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports =  (req, res, next) => {
    // try {
    //         const token = req.headers.authorization.split(' ')[1];
    //         jwt.verify(token, process.env.JWT_SECRET);
    //         next();
    // }catch {
    //      res.status(401).json({message : req.headers});
    // }
    const token = req.cookies.token || '';
   
    try {
        if (!token) {
            return res.status(401).json('You need to Login')
          }
           jwt.verify(token, process.env.JWT_SECRET);
          next();
    }
    catch{
        res.status(401).json({message : req.cookies});
    }

}