const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
    const token = req.header("Authorization")
    if(!token) {
        return res.status(401).json({message: "No token access denied"})
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: payload.id,
        };
        
        next()
    } catch (error) {
        res.status(401).json({ message: "Token invalid" });
    }
}