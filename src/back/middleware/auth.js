const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.JWT_KEY_SECRET;

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secretKey);
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(401).json({error: "User ID non valable !"})
        } else if (req.body.isAdmin && req.body.isAdmin !== isAdmin) {
            console.log(isAdmin)
            return res.status(401).json({error: "User role non valable !"})
        } else{
            console.log(decodedToken)
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};