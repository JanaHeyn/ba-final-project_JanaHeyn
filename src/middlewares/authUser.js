/** EXTERNE DEPENDENCIES */
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

/** VARIABLEN */
const secret = process.env.SECRET_TOKEN;

const authUser = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        
        if(!token) {
            return res.status(403);
        }

        const user = jwt.verify(token, secret);
        req.userId = user.userId;
        req.username = user.username;
        // const admin = user.admin;
        next();

    } catch(error) {
        res.status(401).json({
            success: false,
            message: 'Stop, you are not logged in!'
        });
    }
}

export default authUser;
