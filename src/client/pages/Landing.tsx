import React, { useState, useEffect } from 'react'
import {
    useHistory
} from "react-router-dom"
import { initiateSocket, disconnectSocket, emitToEvent } from '../middlewares/socket'
import { login } from '../services/token'

export default function Landing() {

    const history = useHistory()

    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = () => {
        setError(null)
        emitToEvent('login', username, ({ error, token }: any) => {
            if (error)
                setError(error)
            else {
                login(token)
                history.push('/games-list')
            }
        })
    }

    useEffect(() => {
        localStorage.removeItem('red_tetris_token')
        initiateSocket()
        return () => disconnectSocket()
    }, [history])


    return (
        <div className="pages">

            <input placeholder="username" name="username" value={username} onChange={(ev) => setUsername(ev.target.value)} />
            {error ? <p>{error}</p> : null}
            <button onClick={handleSubmit}>Log</button>
        </div>
    )

}