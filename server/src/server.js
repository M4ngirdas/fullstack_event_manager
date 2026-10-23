
import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import eventsRoutes from "./routes/eventsRoutes.js"

import { connectDB } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use(rateLimiter)
app.use("/api/events", eventsRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is listening on port ${PORT}`)
    })
}) 