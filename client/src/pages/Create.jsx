
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { LuArrowLeft, LuArrowRight, LuLoader } from "react-icons/lu"

import axiosInstance from "../lib/axios.js"

export default function Create(props) {

    const [details, setDetails] = useState({ title: "", description: "", location: "", date: "", fromDate: "", toDate: "", participants: "" })
    const [progress, setProgress] = useState(1)
    const [isChecked, setIsChecked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [skip, setSkip] = useState(false)

    const titleInputRef = useRef(null)
    const locationInputRef = useRef(null)
    const dateInputRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (progress === 1) titleInputRef.current.focus()
        if (progress === 2) locationInputRef.current.focus()
    }, [progress])

    async function createEvent() {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post(
                "/events",
                {
                    title: details.title,
                    description: details.description,
                    location: details.location,
                    date: details.date,
                    fromDate: details.fromDate,
                    toDate: details.toDate
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
        finally {
            setIsLoading(false)
        }
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        const action = ev.nativeEvent.submitter.value

        if (progress === 1 && details.title.length > 0) {
            setProgress(2)
        }
        else if (progress === 2 && skip && action === "skip") {
            setProgress(3)
        }
        else if (progress === 2 && details.location.length > 0) {
            setProgress(3)
        }
        else if (progress === 3 && skip && action === "skip") {
            createEvent()
        }
        else if (progress === 3 && !details.date && !isChecked) return
        else if (progress === 3 && !details.fromDate && !details.toDate && isChecked) return
        else if (progress === 3 && action === "create") {
            createEvent()
        }
        console.log(details)
    }

    return (
        <div className="grid place-items-center content-center gap-12 h-screen">
            <div className="grid gap-24 min-w-[40%]">
                <div className="absolute left-12 top-12">
                    <button onClick={() => navigate("/")} className="flex items-center gap-2 p-4 hover:bg-gray-200"><LuArrowLeft />Go back</button>
                    <h1 className="text-4xl font-bold">Event creation</h1>
                </div>  
                <form onSubmit={handleSubmit} className="grid gap-4 min-h-80">
                    {progress === 1 ? <>
                        <h1 className="text-4xl font-bold">What's the name of your event?</h1>
                        <label htmlFor="title">Title</label>
                        <input
                            onChange={ev => {
                                setDetails(prev => ({ ...prev, title: ev.target.value }))
                            }}
                            ref={titleInputRef}
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Birthday party"
                            className="border px-6 py-2"
                        />
                        <label htmlFor="description">Description (optional)</label>
                        <textarea
                            onChange={ev => {
                                setDetails(prev => ({ ...prev, description: ev.target.value }))
                            }}
                            id="description"
                            name="description"
                            className="border px-6 py-2 resize-none"
                        >
                        </textarea>
                    </> : null}
                    {progress === 2 ? <>
                        <h1 className="text-4xl font-bold">Where is your event happening?</h1>
                        <label htmlFor="location">Location</label>
                        <input
                            onChange={ev => {
                                setDetails(prev => ({ ...prev, location: ev.target.value }))
                            }}
                            ref={locationInputRef}
                            id="location"
                            name="location"
                            type="text"
                            placeholder="My house"
                            className="border px-6 py-2"
                        />
                    </> : null}
                    {progress === 3 ? <>
                        <h1 className="text-4xl font-bold">When is your event due?</h1>
                        {!isChecked ? <div className="grid gap-4">
                            <label htmlFor="title">Title</label>
                            <input
                                onChange={ev => {
                                    setDetails(prev => ({ ...prev, date: ev.target.value }))
                                }}
                                ref={dateInputRef}
                                name="date"
                                type="date"
                                className="border px-6 py-2"
                            />
                        </div> : null}
                        {isChecked ? <div className="grid gap-4">
                            <label htmlFor="fromDate">From</label>
                            <input
                                onChange={ev => {
                                    setDetails(prev => ({ ...prev, fromDate: ev.target.value }))
                                }}
                                id="fromDate"
                                name="fromDate"
                                type="date"
                                className="border px-6 py-2"
                            />
                            <label htmlFor="toDate">To</label>
                            <input
                                onChange={ev => {
                                    setDetails(prev => ({ ...prev, toDate: ev.target.value }))
                                }}
                                id="toDate"
                                name="toDate"
                                type="date"
                                className="border px-6 py-2"
                            />
                        </div> : null}
                        <div className="flex items-center gap-4">
                            <input
                                onChange={ev => setIsChecked(ev.target.checked)}
                                id="checkbox"
                                type="checkbox"
                                className="size-4 cursor-pointer"
                            />
                            <label htmlFor="checkbox">Event lasts more than one day</label>
                        </div>
                    </> : null}
                    <button type="submit" disabled={isLoading} value="create" className={`${isLoading ? "cursor-no-drop opacity-50" : ""} px-6 py-2 uppercase bg-cyan-950 text-white`}>{progress === 3 ? isLoading ? <span className="flex justify-center items-center gap-2"><LuLoader className="animate-spin size-4" />Creating...</span> : "Create event" : "Continue"}</button>
                    {progress !== 1 ? <div>
                        <h3>Don't know yet?</h3>
                        <p>(You can add this later)</p>
                        <button onClick={() => setSkip(true)} type="submit" value="skip" className="flex items-center gap-2">Skip <LuArrowRight /></button>
                    </div> : null}
                </form>
                <div className="flex">
                    <div className="grid w-full">
                        <div className="flex items-center w-full">
                            <div className={`${progress <= 3 ? "bg-rough" : "bg-rough/15"} w-5 h-5 rounded-full`}></div>
                            <div className={`${progress >= 2 ? "bg-rough" : "bg-rough/15"} flex-1 w-45 h-1 bg-rough`}></div>
                        </div>
                        <p className="flex justify-center w-5 mt-2">Title</p>
                    </div>
                    <div className="grid w-full">
                        <div className="flex items-center w-full">
                            <div className={`${progress >= 2 ? "bg-rough" : "bg-rough/15"} w-5 h-5 rounded-full`}></div>
                            <div className={`${progress >= 3 ? "bg-rough" : "bg-rough/15"} flex-1 w-45 h-1 bg-rough`}></div>
                        </div>
                        <p className="flex justify-center w-5 mt-2">Location</p>
                    </div>
                    <div className="grid">
                        <div className={`${progress >= 3 ? "bg-rough" : "bg-rough/15"} w-5 h-5 rounded-full`}></div>
                        <p className="flex justify-center w-5 mt-2">Date</p>
                    </div>
                </div>
            </div>
        </div>
    )
}