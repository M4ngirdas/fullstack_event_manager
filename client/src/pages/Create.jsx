
import { useState } from "react"
import { useNavigate } from "react-router"

import axios from "axios"
import { LuArrowLeft } from "react-icons/lu"

export default function Create(props) {

    const [details, setDetails] = useState({ title: "", description: "", location: "", date: "", participants: "" })
    const [progress, setProgress] = useState(1)

    const navigate = useNavigate()

    async function handleSubmit(ev) {
        ev.preventDefault()

        if (progress === 1 && details.title.length > 0) {
            setProgress(2)
        }
        else if (progress === 2 && details.location.length > 0) {
            setProgress(3)
        }
        else if (progress === 3 && !details.date) return
        else if (progress === 3) {
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/events",
                    {
                        title: details.title,
                        description: details.description,
                        location: details.location,
                        date: details.date,
                    }
                )
                props.setEvents(prev => [response.data, ...prev])
                navigate("/")
                window.alert("event created successfully.")
            }
            catch (error) {
                console.error("failed to create an event", error)
                window.alert("failed to create an event")
            }
        }
    }

    return (
        <div className="grid place-items-center content-center h-screen">
            <div className="absolute left-12 top-12">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 p-4 hover:bg-gray-200"><LuArrowLeft />Go back</button>
                <h1 className="text-4xl font-bold">Event creation</h1>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
                {progress === 1 ? <>
                    <h1 className="text-4xl font-bold">What's the name of your event?</h1>
                    <input
                        onChange={ev => {
                            setDetails(prev => ({ ...prev, title: ev.target.value }))
                        }}
                        name="title"
                        type="text"
                        placeholder="Birthday party"
                        className="border px-6 py-2"
                    />
                    {/* <label htmlFor="description">Description (optional)</label> */}
                    {/* <textarea id="description" name="description" className="border resize-none h-50"></textarea> */}
                </> : null}
                {progress === 2 ? <>
                    <h1 className="text-4xl font-bold">Where is your event hapenning?</h1>
                    <input
                        onChange={ev => {
                            setDetails(prev => ({ ...prev, location: ev.target.value }))
                        }}
                        name="location"
                        type="text"
                        placeholder="My house"
                        className="border px-6 py-2"
                    />
                </> : null}
                {progress === 3 ? <>
                    <h1 className="text-4xl font-bold">When is your event due?</h1>
                    <input
                        onChange={ev => {
                            setDetails(prev => ({ ...prev, date: ev.target.value }))
                        }}
                        name="date"
                        type="date"
                        className="border px-6 py-2"
                    />
                </> : null}
                <button type="submit" className="px-6 py-2 uppercase bg-cyan-950 text-white">Continue</button>
            </form>
        </div>
    )
}