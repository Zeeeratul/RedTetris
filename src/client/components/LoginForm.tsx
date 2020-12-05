import React, { useState, useContext } from 'react'
import '../styles/LoginForm.css'
import { ThemeContext } from '../utils/useTheme'

function LoginForm({ handleSubmit }: any) {

    const { theme, changeTheme } = useContext(ThemeContext)
    const [username, setUsername] = useState('')
    const onSubmit = () => handleSubmit(username)

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
                onKeyDown={({ code }) => code === "Enter" ? onSubmit() : null}
            />
        </div>
    )
}

export default LoginForm
