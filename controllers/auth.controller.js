import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import client from "../utils/redisClient.js";
//import transporter from "../utils/nodemailer.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

const generateOTP = () => {
    const nums = [0,1,2,3,4,5,6,7,8,9]
    let num = ""
    for(let i=0; i<6; i++){
        const randomNumber = Math.floor(Math.random()*10);
        num = num+String(nums[randomNumber])
    }
    return num;
}

export const signUpUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists." });
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP()
        console.log(otp);
        const newUser = {
            name: name,
            email: email,
            password: hashedPassword,
            otp: otp
        }

        await client.setEx(`user_${email}`, 600, JSON.stringify(newUser))

        /*transporter.sendMail({
            from: process.env.GMAIL_ID,
            to: email,
            subject: "OTP",
            html: `<div>OTP</div>`
        })*/

        res.status(201).json({
            success: true,
            message: "User created successfully. Enter the otp now",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Error in signUpUser:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const verifyOTPAndSave = async (req, res) => {
    try {
        const { otp, email } = req.body;
        
        if (!otp || !email) {
            return res.status(400).json({ success: false, message: "OTP and email are required." });
        }

        // Retrieve user data from Redis
        const userData = await client.get(`user_${email}`);
        
        if (!userData) {
            return res.status(400).json({ success: false, message: "OTP expired or invalid. Please sign up again." });
        }

        // Parse the user data (assuming it's stored as JSON string)
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        // Create user in database (without OTP field)
        const { otp: _, ...userDataToSave } = user;
        const savedUser = await User.create(userDataToSave);

        await savedUser.save();

        await client.del(`user_${email}`);

        res.status(200).json({
            success: true,
            message: "User verified and created successfully.",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            },
        });

    } catch (error) {
        console.error("Error in verifyOTPAndSave:", error);
        
        if (error.code === 11000) {
            const { email } = req.body;
            if (email) {
                await client.del(`user_${email}`);
            }
            return res.status(400).json({ success: false, message: "User already exists. Please login." });
        }
        
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const {accessToken, refreshToken} = generateTokens(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
        })
        .json({
            success: true,
            message: "Login successful.",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const test = (req, res) => {
    res.status(200).json({ success: true, message: "Auth route is working!" });
}