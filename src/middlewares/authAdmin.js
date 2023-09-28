/** EXTERNE DEPENDENCIES */
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

/** VARIABLEN */
const secret = process.env.SECRET_TOKEN;

const authAdmin = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token) {
        return res.status(403);
    }

    try {
        const user = jwt.verify(token, secret);
        const admin = user.admin;
        // req.admin = user.admin;

        if(admin === true) {
            next();
        } else {
            res.status(400).json({
                success: false,
                message: 'Sorry, but you dont have the force to do that!'
            });
        }

    } catch(err) {
        next(err);
    }
}

export default authAdmin;
