// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Add the user's ID to the request object
    next(); // Proceed to the route
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default protect;