import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from "../lib/cloudinary.js"

// SignUp's the user into the system.
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    // create a user, hash their password, create a token to authenticate them.
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Fill all the fields." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least of 6 character length" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "email already exist" });
        }

        // password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        })

        if (newUser) {
            // exist successfully, generate JWT, utils.js file.
            generateToken(newUser._id, res);
            await newUser.save(); // save the newUser info into the database

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        } else {
            res.status(400).json({ message: "Invalid user details" });
        }

    } catch (error) {
        console.log("Error during signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Logout's the user from system.
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })
        res.status(201).json({ message: "Logged out Successfully" });
    } catch (error) {
        console.log("Error in Log out Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Login's the user into the system
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please Enter the Credential" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Wrong Credential" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Wrong Credential" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update profile photo
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updateUser);
    } catch (error) {
        console.log("error in update profile: ", error);
        res.status(500).json({ message: "Internal Error" });
    }
};

// when you refresh on authentication page
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth Controller", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
}