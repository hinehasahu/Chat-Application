import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { UserModel } from "../models/userModel.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashed });
    const token = jwt.sign(
      { userId: user._id, name, email },
      process.env.JWT_SECRET
    );
    const url = `https://chat-application-mvvh.onrender.com/api/users/verify/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Verify Email",
      html: `Click <a href='${url}'>here</a>`,
    });
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", Error: error.message });
    console.log(error);
  }
};

export const mailVerify = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await UserModel.findByIdAndUpdate(decoded.userId, { isVerified: true });
    res.send("Email verified.");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", Error: error.message });
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please signup" });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first." });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ Token: token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong.", Error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const url = `https://chat-application-mvvh.onrender.com/api/users/reset-password/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `Click <a href='${url}'>here</a> to reset password`,
    });

    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", Error: error.message });
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body; //new password
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();
    res.json({ message: "Passwrod updated." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", Error: error.message });
    console.log(error);
  }
};

export const searchUser = async (req, res) => {
  try {
    const keyword = req.query.name
      ? {
          name: { $regex: req.query.name, $options: "i" },
          _id: { $ne: req.user._id },
        }
      : { _id: { $ne: req.user._id } };

    const users = await UserModel.find(keyword).limit(10).select("-password");
    console.log("Found-users: ", users);
    res.json({ Users: users });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
    console.log(error);
  }
};

// export const getAllUsersExceptMe = async (req, res) => {
//   try {
//     const users = await UserModel.find({ _id: { $ne: req.user._id } }).select("-password");
//     res.json({Users:users});
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch users" });
//     console.log(error)
//   }
// };
