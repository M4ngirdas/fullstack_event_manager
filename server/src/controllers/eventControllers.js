
import Event from "../models/Event.js"

export async function getEvents(req, res) {
    try {
        const events = await Event.find().sort({ createdAt: -1 })
        res.status(200).json(events)
    }
    catch (error) {
        console.error("error in getEvents controller", error)
        res.status(500).json({ message: "internal server error" })
    }
}

export async function getEventById(req, res) {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) return res.status(404).json({ message: "event not found." })
        res.status(200).json(event)
    }
    catch (error) {
        console.error("error in getEventById controller", error)
        res.status(500).json({ message: "internal server error" })
    }
}

export async function createEvent(req, res) {
    try {
        const { title, description, date, location, fromDate, toDate, participants } = req.body
        const newEvent = new Event({ title, description, date, location, fromDate, toDate, participants })
        const savedEvent = await newEvent.save()
        res.status(201).json(savedEvent)
    }
    catch (error) {
        console.error("error in createEvent controller", error)
        res.status(500).json({ message: "internal server error" })
    }
}

export async function updateEvent(req, res) {
    try {
        const { title, description, date, location, fromDate, toDate, participants } = req.body
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, date, location, fromDate, toDate, participants }
        )
        if (!updatedEvent) return res.status(404).json({ message: "event not found." })
        res.status(200).json({ message: "event updated successfully." })
    }
    catch (error) {
        console.error("error in updateEvent controller", error)
        res.status(500).json({ message: "internal server error" })
    }
}

export async function deleteEvent(req, res) {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id)
        if (!deletedEvent) res.status(404).json({ message: "event not found." })
        res.status(200).json({ message: "event deleted successfully." })
    }
    catch (error) {
        console.error("error in deleteEvent controller", error)
        res.status(500).json({ message: "internal server error" })
    }
}