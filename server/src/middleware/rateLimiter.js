
import ratelimit from "../config/upstash.js"

export default async function rateLimiter(req, res, next) {
    try {
        const { success } = await ratelimit.limit("my-rate-limit")
        if (!success) return res.status(429).json({ message: "too many requests. try again later." })
        next()
    } catch (error) {
        console.error("rate limit error", error)
        next(error)
    }
}