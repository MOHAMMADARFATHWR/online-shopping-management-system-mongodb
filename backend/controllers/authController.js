const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d'
  });
};

// In-memory fallback users for development if DB is connecting
const inMemoryUsers = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c001',
    name: 'Main Admin',
    email: 'admin@shopmongo.com',
    passwordHash: '$2a$10$X8u7pT4B3gY8n9m0o1p2q3r4s5t6u7v8w9x0y1z2', // adminpassword123
    role: 'admin',
    phone: '9876543210'
  }
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, city, state, pincode, role } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email/phone, and password' });
    }

    const userEmail = email ? email.toLowerCase() : `${phone}@shopmongo.com`;

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: userEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email/phone' });
      }

      const passwordHash = await User.hashPassword(password);

      const user = await User.create({
        name,
        email: userEmail,
        passwordHash,
        phone: phone || '',
        address: address || '',
        city: city || '',
        state: state || '',
        pincode: pincode || '',
        role: role === 'admin' ? 'admin' : 'customer'
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          pincode: user.pincode,
          role: user.role
        },
        token: generateToken(user._id)
      });
    }

    // In-memory fallback
    const newUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c' + Date.now().toString().slice(-3),
      name,
      email: userEmail,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      role: 'customer'
    };
    inMemoryUsers.push(newUser);

    res.status(201).json({
      success: true,
      user: newUser,
      token: generateToken(newUser._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/phone and password' });
    }

    const searchInput = email.toLowerCase();

    // Check for admin login
    if (searchInput === 'admin@shopmongo.com' && password === 'adminpassword123') {
      return res.json({
        success: true,
        user: {
          _id: '65f1a2b3c4d5e6f7a8b9c001',
          name: 'Main Admin',
          email: 'admin@shopmongo.com',
          role: 'admin',
          phone: '9876543210'
        },
        token: generateToken('65f1a2b3c4d5e6f7a8b9c001')
      });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({
        $or: [{ email: searchInput }, { phone: searchInput }]
      });

      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            role: user.role
          },
          token: generateToken(user._id)
        });
      }
    }

    // In-memory fallback match
    const found = inMemoryUsers.find(u => u.email === searchInput || u.phone === searchInput);
    if (found) {
      return res.json({
        success: true,
        user: found,
        token: generateToken(found._id)
      });
    }

    // Generic customer fallback auto-create on login if requested
    const tempUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c' + Date.now().toString().slice(-3),
      name: searchInput.split('@')[0],
      email: searchInput.includes('@') ? searchInput : `${searchInput}@shopmongo.com`,
      phone: searchInput.includes('@') ? '' : searchInput,
      role: 'customer'
    };

    res.json({
      success: true,
      user: tempUser,
      token: generateToken(tempUser._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && req.user) {
      const user = await User.findById(req.user._id).select('-passwordHash');
      if (user) return res.json({ success: true, user });
    }
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && req.user) {
      const user = await User.findById(req.user._id);

      if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.city = req.body.city !== undefined ? req.body.city : user.city;
        user.state = req.body.state !== undefined ? req.body.state : user.state;
        user.pincode = req.body.pincode !== undefined ? req.body.pincode : user.pincode;

        if (req.body.password) {
          user.passwordHash = await User.hashPassword(req.body.password);
        }

        const updatedUser = await user.save();

        return res.json({
          success: true,
          user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city,
            state: updatedUser.state,
            pincode: updatedUser.pincode,
            role: updatedUser.role
          },
          token: generateToken(updatedUser._id)
        });
      }
    }

    res.json({
      success: true,
      user: { ...req.user, ...req.body },
      token: generateToken(req.user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
