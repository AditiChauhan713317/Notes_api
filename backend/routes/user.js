const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router()

function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}


router.post("/signup", async(req, res)=> {
    try {
        const {username, password} = req.body

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPasswd = await bcrypt.hash(password, 10)

        const user = new User({
            username,
            password: hashedPasswd
        })

        // if(!user) {
        //     return res.status()
        // }

        await user.save()

        // auto login (create token)
        const token = generateToken(req.user.id)

        res.status(201).json({message: "user created", token: token})
    } catch (error) {
         res.status(500).json({ message: "Server error" });
    }
})

router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const user = await User.findOne({username})
        if(!user){
            return res.status(401).json({message: "invalid credentials"})
        }

        // username exists so check passwd
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            res.status(401).json({message: "invalid credentials"})
        }

        // both match -> create token
        const token = generateToken(req.user.id)

        res.json({token})

    } catch {
        res.status(500).json({ message: "Server error" });
    }

})
