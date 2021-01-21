/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useState } from 'react'
import { SOCKET } from '../../config/constants.json'

const errorMessages: { [index: string] : string } = {
    [SOCKET.AUTH.ERROR.INVALID_USERNAME]: "Invalid username",
    [SOCKET.AUTH.ERROR.USERNAME_TAKEN]: "Username is taken",
}

function LoginForm({ onSubmit, error }: { onSubmit: any, error?: string }) {

    const [username, setUsername] = useState('')

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        onSubmit(username)
    }

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(ev.target.value)
    }

    return (
        <form
            onSubmit={handleSubmit}
            css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <label
                css={(theme: any) => ({
                    fontSize: '38px',
                    marginBottom: '20px',
                    color: theme?.colors?.text1,
                    textAlign: 'center',
                    '@media (max-width: 650px)': {
                        fontSize: '28px',
                    }
                })}
                htmlFor="username"
            >
                what's your username ?
            </label>
            <input
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
                maxLength={15}
                autoFocus
                css={(theme: any) => ({
                    width: '400px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    borderBottom: `2px solid ${theme?.colors?.text1}`,
                    textAlign: 'center',
                    paddingBottom: '15px',
                    letterSpacing: '3px',
                    fontSize: '24px',
                    color: theme?.colors?.text1,
                    fontFamily: 'Audiowide, cursive',
                    '@media (max-width: 550px)': {
                        fontSize: '18px',
                        width: '250px'
                    },
                })}
            />
            {error && 
                <p data-testid="error-text"
                    css={{
                        marginTop: '30px',
                        marginBottom: '0px',
                        color: 'red',
                        fontSize: '22px'
                    }}
                >
                    {errorMessages[error]}
                </p>
            }
        </form>
    )
}

export default LoginForm