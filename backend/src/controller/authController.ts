import { Request, Response } from "express";
import { User } from "../models/user";
import { validateLoginUser, validateSignupUser } from "../utils/validation";
import bcrypt from "bcryptjs";

interface AuthenticationRequest extends Request {
    user?: any;
}

export const registerUser = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        validateSignupUser(req.body);
        const { email, firstName, lastName, password } = req.body;

        const hashpassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashpassword,
        });
        await user.save();
        const token = user.getjwt();

        res.cookie("token", token, {
            maxAge: 2 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(201).json({
            success: true,
            message: "User registered Successfully",
            token: token,
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (err: any) {
        console.log("Error:", err.message);

        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    console.log("rounting working");
    try {
        validateLoginUser(req.body);

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                message: "invalid email or password",
            });
            return;
        }
        const token = user.getjwt();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: `${user.firstName} login Successfully`,
            token,
        });
    } catch (err: any) {
        console.log("Login Exception:", err.message);

        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const getUserProfile = async (
    req: AuthenticationRequest,
    res: Response,
): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            message: "Profile dashboard ata fetched successfully",
            user: req.user,
        });
    } catch (err: any) {
        console.log("Profile Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error while recieving profile data",
        });
    }
};
