import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import generateToken from "../utils/generateToken.js";
import cookieOptions from "../config/cookieOptions.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields (name, email, password) are required" });
    }

    if (name.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    // Generate token and set cookie
    const token = await generateToken(user._id);
    res.cookie("jwt", token, cookieOptions);

    // Save token in Token collection
    await Token.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const token = await generateToken(user._id);
    res.cookie("jwt", token, cookieOptions);

    // Save token in Token collection
    await Token.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};


export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.jwt;
    if (token) {
      await Token.deleteOne({ token });
    }
    res.clearCookie("jwt");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Server error during logout" });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get Current User Error:", error.message);
    res.status(500).json({ message: "Server error fetching user" });
  }
};
