const express = require("express")
const router = express.Router()
const Note = require('../models/Note')
const auth = require("../middleware/auth")

router.post("/", auth, async(req, res)=> {
    try {
        const {title, content} = req.body

        const newNote = new Note ({
            title,
            content
        })

        const savedNote = await newNote.save()
        
        res.status(201).json(savedNote) // status 201 = resource created


    } catch (error) {
        res.status(500).json({message: "server error"})
    }
})


router.get("/", auth, async (req,res) => {

    try {
        const notes = await Note.find({user: req.user.id}).sort({createdAt: -1})
        res.json(notes)
    } catch (error) {
        res.status(500).json({message: "server error"})
    }
})

router.delete("/:id", auth, async (req, res)=>{
    try {
        const note = await Note.findById(req.params.id)
        if(!note) {
            return res.status(404).json({message: "Note not found"})
        }

        // check ownership (otherwise any loggedin user can delete your note)
        if(note.user.toString() != req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }
        // 403 -> forbidden

        await note.deleteOne()
        
        res.json({message: "Note deleted"})

    } catch (error) {
        res.status(500).json({message: "server error"})
    }
})


router.put("/:id", auth, async (req, res)=> {
    try {
        const {title, content} = req.body

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {title, content},
            {new: true, runValidators: true}
            // { new: true } → return the updated document (not the old one)
            // runValidators: true → schema rules still apply
        )

        if(!updatedNote) {
            return res.status(404).json({message: "note not found"})
        }

        res.json(updatedNote) // If you don’t explicitly set a status, Express defaults to HTTP 200 OK for successful responses.

    } catch (error) {
        res.status(500).json({message: "server error"})
    }
})
module.exports = router