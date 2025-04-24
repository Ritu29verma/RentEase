const jwt = require('jsonwebtoken');

const tenantAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ detail: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "tenant") {
      return res.status(403).json({ detail: "Forbidden: Not a tenant" });
    }

    req.tenantId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
};

const adminAuth = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ detail: "Authorization token missing" });
      }
  
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      if (decoded.role !== "admin") {
        return res.status(403).json({ detail: "Forbidden: Not an admin" });
      }
  
      req.adminId = decoded.userId;
      next();
    } catch (err) {
      return res.status(401).json({ detail: "Invalid or expired token" });
    }
  };
  
module.exports = { tenantAuth, adminAuth};
