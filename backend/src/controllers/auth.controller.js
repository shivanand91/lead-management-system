import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All Fields Required!" });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({ message: "User already exist!" });
    }    

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });
    generateToken(res, user._id);
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Save token in the user's record (ensure your User model has a field for token)
    user.token = token;
    await user.save();

    res.status(201).json({
      message: "User created successfully!",
      id: user._id,
      name: user.name,
      email: user.email,
      token
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({message: "All fields are required!"})
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'User not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    generateToken(res, user._id);
    res.status(200).json({message: "User logged in successfully!", id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
};

export const currentUser = (req, res) => {
  res.status(200).json({ id: req.userId });
};
