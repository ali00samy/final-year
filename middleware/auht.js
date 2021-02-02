const jwt = require('jsonwebtoken');

module.exports = function (req,res,next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('accses denied');

    try {
        const decode = jwt.verify(token, 'Alikey')
        req.user = decode;
        next();
    }

    catch(ex) {
        res.status(400).send('invalid token');
    }
}