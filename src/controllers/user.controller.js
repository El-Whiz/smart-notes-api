const UserModel = require('../models/user.model.js');
const { hash_password } = require('../utils/bcrypt.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const healthCheck = (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashed = await hash_password(password);
    const user = new UserModel({ email, password: hashed});
    await user.save();

    const token = generateToken(user);
    const resUser = { id: user._id.toString(), email: user.email };

    return res.status(201).json({ message: 'User registered successfully.', user: resUser, token });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    const resUser = { id: user._id.toString(), email: user.email };

    return res.status(200).json({ message: 'Logged in successfully.', user: resUser, token });
  } catch (error) {
    next(error);
  }
};

const addPicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Avatar file is required.' });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: req.file.path },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ message: 'Avatar uploaded successfully.', data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed.' });
  }
};

const setProfile = async (req, res, next) => {
  try {
    const { name, goal, style, pace } = req.body;

    if (!name || !goal || !style || !pace) {
      return res.status(400).json({ error: 'All profile fields are required.' });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.name = name;
    user.goal = goal;
    user.style = style;
    user.pace = pace;
    await user.save();

    return res.status(200).json({ profile: { id: user._id.toString(), name, goal, style, pace } });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const user = await UserModel.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    return res.json({ profile: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const allowed = ['name', 'goal', 'style', 'pace'];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    return res.json({ profile: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  healthCheck,
  registerUser,
  loginUser,
  addPicture,
  setProfile,
  getProfile,
  updateProfile,
};
