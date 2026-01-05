const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const noteRoutes = require('./routes/note')

const app = express()

//allows the frontend to call the api
app.use(cors())
// parses incoming json to req.body
app.use(express.json())


//connect mongodb
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongodb connected")
    } catch (error) {
        console.error(error)
    }
}


connectDB()

//routes
app.use("/notes", noteRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

