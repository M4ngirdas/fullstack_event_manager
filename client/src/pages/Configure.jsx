
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { LuArrowLeft, LuLoader } from "react-icons/lu"
import { useNavigate } from "react-router"
import { formatDate } from "../lib/utils.js"

import axiosInstance from "../lib/axios.js"

export default function Configure() {

    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await axiosInstance.get(`/events/${id}`)
                setSelectedEvent({ ...response.data, date: response.data.date.slice(0, 10) })
            }
            catch (error) {
                console.error("failed to fetch an event", error)
                window.alert("something went wrong.")
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchEvent()
    }, [id])

    console.log(selectedEvent)

    async function saveChanges(ev) {
        ev.preventDefault()
        const formData = new FormData(ev.currentTarget)

        const title = formData.get("title")
        const description = formData.get("description")
        const location = formData.get("location")
        const date = formData.get("date")

        try {
            await axiosInstance.put(
                `/events/${id}`,
                { title, description, location, date }
            )
            navigate("/")
            window.alert("event updated successfully.")
        }
        catch (error) {
            console.error("failed to save changes.", error)
            window.alert("failed to save changes.")
        }
    }

    if (isLoading) {
        return (
            <span className="grid place-items-center content-center gap-4 h-100"><LuLoader className="animate-spin size-20 place-items-center" /> Loading event</span>
        )
    }

    return (
        <main className="p-12">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 p-4 hover:bg-gray-200"><LuArrowLeft />Go back</button>
            <h1 className="text-4xl font-bold">Event configuration</h1>
            <form onSubmit={saveChanges} className="grid gap-4 mt-16 w-1/2">
                <div className="flex">
                    <label htmlFor="title" className="w-30">Title</label>
                    <input id="title" name="title" defaultValue={selectedEvent.title} type="text" className="border px-6 py-2 w-full" />
                </div>

                <div className="flex">
                    <label htmlFor="description" className="w-30">Description</label>
                    <input id="description" name="description" defaultValue={selectedEvent.description ? selectedEvent.description : null} type="text" className="border px-6 py-2 w-full" />
                </div>

                <div className="flex">
                    <label htmlFor="location" className="w-30">Location</label>
                    <input id="location" name="location" defaultValue={selectedEvent.location} type="text" className="border px-6 py-2 w-full" />
                </div>

                <div className="flex">
                    <label htmlFor="date" className="w-30">Date</label>
                    <input id="date" name="date" defaultValue={selectedEvent.date} type="date" className="border px-6 py-2 w-full" />
                </div>
                <button type="submit" className="px-6 py-2 uppercase bg-cyan-950 text-white">Save changes</button>
            </form>
        </main>
    )
}