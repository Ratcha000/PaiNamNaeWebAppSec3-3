require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("Missing JWT_SECRET in environment");
}

const signToken = (payload, options = { expiresIn: "1h" }) => {
    return jwt.sign(payload, secret, options);
};

const verifyToken = (token) => {
    return jwt.verify(token, secret);
};

module.exports = { signToken, verifyToken };