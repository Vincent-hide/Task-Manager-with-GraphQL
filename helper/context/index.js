const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

module.exports.verifyUser = async (req) => {
  // console.log(req.headers); // Http headers
  try {
    req.email = null;
    req.userId = null;
    const bearerHeader = req.headers.authorization;

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      // console.log("token===", token);
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || "mysecretkey"
      );
      req.email = payload.email;
      // console.log("payload:", payload);
      const user = await User.findOne({ email: payload.email });
      req.userId = user.id;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
