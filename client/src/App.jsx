
import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router"

import Dashboard from "./pages/Dashboard.jsx"
import Create from "./pages/Create.jsx"
import Configure from "./pages/Configure.jsx"

export default function App() {

    const [events, setEvents] = useState([])

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Dashboard events={events} setEvents={setEvents} />} />
                <Route path="/create" element={<Create events={events} setEvents={setEvents} />} />
                <Route path="/configure/:id" element={<Configure />} />
            </Routes>
        </BrowserRouter>
    )
}