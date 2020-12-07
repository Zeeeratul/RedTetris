import React, { useState, useEffect, useContext } from 'react'
import '../styles/Landing.css'
import { useHistory } from "react-router-dom"
import { initiateSocket, emitToEvent } from '../middlewares/socket'
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
                history.push('/games')
                console.log(username)
            }
        })
    }

    return (
        <div className={`page ${theme}`}>
            <div className="landing_container">
                {/* <button onClick={() => changeTheme()}>
                    Change theme
                </button> */}

                <h3>What's your username?</h3>
                <input
                    name="username"
                    maxLength={15}
                    onChange={(ev) => setUsername(ev.target.value)}
                    onKeyDown={({ code }) => code === "Enter" ? handleSubmit() : null}
                />
            </div>
        </div>
    )
}

export default Landing