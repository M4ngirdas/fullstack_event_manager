
import mongoose from "mongoose"

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongodb connected")
    }
    catch (error) {
        console.error("error connecting to db", error)
        process.exit(1)
    }
}