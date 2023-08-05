const User = require("../Modals/UserSchema");

function authorize(allowedRoles) {
  return async (req, res, next) => {
    // console.log(req.user)
    const userId = req.user;

    const user = await User.findById(userId);

    const userRole = user.Role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  };
}

module.exports = authorize;
