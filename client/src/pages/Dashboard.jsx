
import { useState, useEffect } from "react"
import { formatDate } from "../lib/utils.js"
import { LuArrowRight, LuCalendar, LuInfo, LuLoader, LuMapPin, LuTrash2 } from "react-icons/lu"
import { useNavigate } from "react-router"

import axios from "axios"

export default function Dashboard(props) {

    const [isLoading, setIsLoading] = useState(false)
    const [isRateLimited, setIsRateLimited] = useState(false)

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
        <li key={event._id} className="grid gap-2 min-w-120 p-4 bg-rough text-pale">
            <div className="grid gap-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">{event.title}</h1>
                        <h2>{event.description}</h2>
                    </div>
                    <button onClick={() => deleteEvent(event._id)} className="text-rose-600"><LuTrash2 /></button>
                </div>
                {(event.fromDate === null && event.toDate === null) || event.date !== null ? <p className="flex items-center gap-2"><LuCalendar />{event.date ? formatDate(new Date(event.date)) : "no date set"}</p> : null}
                {event.fromDate && event.toDate ? <div className="flex items-start gap-2">
                    <LuCalendar className="mt-1" />
                    <div className="flex flex-col items-start">
                        <p>From: {formatDate(new Date(event.fromDate))}</p>
                        <p>To: {formatDate(new Date(event.toDate))}</p>
                    </div>
                </div> : null}
                <p className="flex items-center gap-2"><LuMapPin />{event.location ? event.location : "no location set"}</p>
                <p>{event.participants}</p>
            </div>
            <button onClick={() => navigate(`/configure/${event._id}`)} className="px-6 py-2 flex-1 uppercase bg-gold text-white">Configure</button>
        </li>
    )


    return (
        <main className="grid place-items-center gap-12 p-12">
            <button onClick={() => navigate("/create")} className="px-6 py-2 uppercase bg-off-navy text-white">Create event</button>
            <ul className="grid gap-4">
                {isLoading ? <span className="grid place-items-center content-center gap-4 h-100"><LuLoader className="animate-spin size-20 place-items-center" /> Loading events</span> : eventElements}
                {props.events.length === 0 && !isLoading
                    ? <div className="grid place-items-center gap-4">
                        <LuInfo className="size-15" />
                        <h1 className="text-4xl font-bold">No events found.</h1>
                        <h2>Ready to organize your events?</h2>
                        <button onClick={() => navigate("/create")} className="flex items-center gap-2">Create event <LuArrowRight /></button>
                    </div>
                    : null}
            </ul>
        </main>
    )
}