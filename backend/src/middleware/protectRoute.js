import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protectRoute = async (req, res, next) => {
    try {
        // grab token
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized-no token provided" });
        }

        // helps to decode the token of user and find it's userId, why userId because when creating tokens
        // you passed the userId as payload.
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodeToken) {
            return res.status(400).json({ message: "Unauthorized - Invalid token" });
        }

        // this line helps us to find the field corresponding to a userId and "-password" will not be selected.
        const user = await User.findById(decodeToken.userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // add user field with user detail altogether in req object
        req.user = user;

        next(); // direct the flow to next middleware, updateProfile.
    } catch (error) {
        console.log("Error in protectRoute middleware.", error.message);
        res.status(500).json({ message: "Internal Error" });
    }
}