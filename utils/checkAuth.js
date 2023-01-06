import jwt from "jsonwebtoken";

// Middleware for check token and then give data if it true

export default (req, res, next) => {
  // Parsing token
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret228");
      req.userId = decoded._id;
      next();
    } catch (error) {
      console.warn(error);
      return res.status(403).json({
        message: "Something wrong",
      });
    }
  } else {
    return res.status(403).json({
      message: "You don't have access",
    });
  }
};
