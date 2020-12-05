import React, { useState, useEffect, useContext } from 'react'
import {
    useHistory
} from "react-router-dom"
import { initiateSocket, emitToEvent } from '../middlewares/socket'

import '../styles/LoginForm.css'
import { ThemeContext } from '../utils/useTheme'

function Landing() {

    const history = useHistory()
    const { theme, changeTheme } = useContext(ThemeContext)
    const [username, setUsername] = useState('')

    useEffect(() => {
        initiateSocket()
    }, [])

    const handleSubmit = () => {
        emitToEvent('login', username, ({ username, error }: any) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log(username)
            }
        })
    }

    return (
        <div className={`page ${theme}`}>
            <button onClick={() => changeTheme()}>
                Change theme
            </button>

            <h3>What's your username?</h3>
            <input
                className="usernameInput"
                name="username"
                maxLength={15}
                onChange={(ev) => setUsername(ev.target.value)}
                onKeyDown={({ code }) => code === "Enter" ? handleSubmit() : null}
            />
        </div>
    )
}

export default Landing