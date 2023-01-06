import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    // Add user to DB
    // HashPassword with bcrypt
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    //
    // User fields
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatar: req.body.avatar,
      passwordHash,
    });
    //
    // save in DB
    const user = await doc.save();
    //
    // Generate JWT
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret228",
      {
        expiresIn: "30d",
      }
    );
    //
    //

    const { hash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.warn(err);
    res.status(500).json({
      message: "Auth Error",
    });
  }
};
//
export const login = async (req, res) => {
  try {
    // Find user
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    // Check email
    if (!user) {
      return req.status(404).json({
        message: "User not found",
      });
    }
    // Check password
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPassword) {
      return res.status(404).json({
        message: "Invalid password or login",
      });
    }
    //
    // Generate token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret228",
      {
        expiresIn: "30d",
      }
    );
    //
    // Destruckt data
    const { hash, ...userData } = user._doc;
    // Response
    res.json({
      ...userData,
      token,
    });
    //
    //
  } catch (err) {
    console.warn(err);
    res.status(400).json({
      message: "Auth Error",
    });
  }
};
//
export const auth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not Found",
      });
    }

    // Destruckt data
    const { hash, ...userData } = user._doc;
    // Response
    res.json({
      ...userData,
    });
    //
  } catch (error) {
    console.log(error);
    res.send(403).json({
      message: "Something wrong",
    });
  }
};
//
