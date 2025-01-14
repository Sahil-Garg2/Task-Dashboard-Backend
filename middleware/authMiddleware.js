const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  const token =
    req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = await User.findById(decoded.id).populate("role").populate('categories.category').populate('categories.assignedRole'); // Add user to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin authorization middleware
const isAdmin = (req, res, next) => {
  if (req.user.role?.name !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Access denied, admin privileges required' });
  }
  next();
};

const isUser = (req, res, next) => {

  if (req.user?.role?.name !== 'user' && req.user?.role?.name !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Access denied, user privileges required' });
  }
  next();
};
module.exports = { protect, isAdmin, isUser };
