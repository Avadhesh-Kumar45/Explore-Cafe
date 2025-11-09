const protectAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    next();
  };
  
  export default protectAdmin;
  