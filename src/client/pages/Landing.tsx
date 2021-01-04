/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { ErrorBoundary } from 'react-error-boundary'
import { initiateSocket, emitToEventWithAcknowledgement } from '../middlewares/socket'
import { SOCKET } from '../config/constants.json'
import background from './background.jpg'

function ErrorFallback({error, resetErrorBoundary}: any) {
    return (
        <div role="alert">
            <p>Oups... Something went wrong:</p>
            <pre style={{color: 'red'}}>{error?.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    )
}

function LandingWrapper({ setUser }: any) {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Landing setUser={setUser} />
        </ErrorBoundary>
    )
}

function Landing({ setUser }: any) {

    const history = useHistory()
    const [error, setError] = useState('')
    useEffect(() => {
        initiateSocket()
    }, [])

    const handleSubmit = (ev: any) => {
        ev.preventDefault()
        const { username } = ev.target.elements
        if (username.value) {
            emitToEventWithAcknowledgement(SOCKET.AUTH.LOGIN, username.value, (error, data) => {
                if (error) {
                    console.log(error)
                    setError(error)
                }
                else {
                    setUser(data)
                    history.push('/games')
                }
            })

        }
    }

    if (error === 'socket_not_connected')
        throw new Error(error)

    return (
        <div className="landing_container" 
            css={{
                height: '100vh',
                color: 'white',
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <form
                onSubmit={handleSubmit}
                css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
            >
                <label
                    css={{
                        fontSize: '38px',
                        marginBottom: '20px',
                        '@media (max-width: 550px)': {
                            fontSize: '28px',
                        }
                    }}
                    htmlFor="username"
                >
                    What's your username ?
                </label>
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <input
                        id="username"
                        name="username"
                        maxLength={15}
                        autoFocus
                        css={{
                            width: '400px',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            borderBottom: '2px solid white',
                            textAlign: 'center',
                            paddingBottom: '15px',
                            letterSpacing: '3px',
                            fontSize: '24px',
                            color: 'white',
                            fontFamily: 'Montserrat, sans-serif',
                            '@media (max-width: 550px)': {
                                fontSize: '18px',
                                width: '250px'
                            }
                        }}
                    />
                    <button type="submit"
                        css={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',

                        }}
                    >
                        <ArrowForwardIcon
                            fontSize="large"
                            css={{
                                color: "white",
                                opacity: '0.75',
                                marginTop: '25px',
                                marginLeft: '10px',
                                '&:hover': {
                                    opacity: '1',
                                    transform: 'translateX(5px)',
                                    transition: '400ms ease'
                                },
                                '&:active': {
                                    color: 'grey'
                                }
                            }}
                        />
                    </button>
                    {error}

                </div>
            </form>
        </div>
    )
}

export default LandingWrapper