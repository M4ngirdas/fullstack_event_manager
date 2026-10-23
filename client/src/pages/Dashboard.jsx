
import { useState, useEffect } from "react"
import { formatDate } from "../lib/utils.js"
import { LuLoader } from "react-icons/lu"
import { useNavigate } from "react-router"

import axios from "axios"

export default function Dashboard(props) {

    const [isLoading, setIsLoading] = useState(false)
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchEvents() {

            setIsLoading(true)

            try {
                const response = await axios.get("http://localhost:5000/api/events")
                props.setEvents(response.data)
            }
            catch (error) {
                console.error("error fetching events", error)
                if (error.response?.status === 429) {
                    setIsRateLimited(true)
                }
                else {
                    window.alert("failed to load events.")
                }
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchEvents()
    }, [])

    async function deleteEvent(id) {

        if (!window.confirm("are you sure you want to delete this event?")) return

        try {
            await axios.delete(`http://localhost:5000/api/events/${id}`)
            props.setEvents(prev => prev.filter(event => event._id !== id))
            window.alert("event deleted successfully")
        }
        catch (error) {
            console.error("failed to delete an event", error)
            window.alert("failed to to delete an event")
        }
    }

    const eventElements = props.events.map(event =>
        <li key={event._id} className="grid gap-2 p-4 bg-cyan-100">
            <div>
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <h2>{event.description}</h2>
                <p>{formatDate(new Date(event.date))}</p>
                <p>{event.location}</p>
                <p>{event.participants}</p>
            </div>
            <div className="flex gap-4">
                <button onClick={() => navigate(`/configure/${event._id}`)} className="flex-1 py-2 uppercase bg-cyan-900 text-white">Configure</button>
                <button onClick={() => deleteEvent(event._id)} className="px-6 py-2 uppercase bg-rose-600 text-white">Delete</button>
            </div>
        </li>
    )

    return (
        <main className="grid place-items-center gap-12 p-12">
            <button onClick={() => navigate("/create")} className="px-6 py-2 uppercase bg-cyan-950 text-white">Create event</button>
            <ul className="grid gap-4">
                {isLoading ? <span className="grid place-items-center content-center gap-4 h-100"><LuLoader className="animate-spin size-20 place-items-center" /> Loading events</span> : eventElements}
            </ul>
        </main>
    )
}