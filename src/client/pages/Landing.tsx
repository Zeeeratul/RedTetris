/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { initiateSocket, emitToEventWithAcknowledgement } from '../middlewares/socket'
import { SOCKET } from '../config/constants.json'
import { PageContainer, Navbar } from '../components/Template'
import { Paper } from '@material-ui/core'
import background from '../assets/tetris-background.jpg'

const errorMessages: { [index: string] : string } = {
    [SOCKET.AUTH.ERROR.INVALID_USERNAME]: "Invalid username",
    [SOCKET.AUTH.ERROR.USERNAME_TAKEN]: "Username is taken",
}

function Landing({ setUser }: any) {
    const history = useHistory()
    const [error, setError] = useState('')
    useEffect(() => {
        initiateSocket()
    }, [])
    
    const [toggle, setToggle] = useState(false)

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

    return (
        <PageContainer
            backgroundImage={`url(${background})`}
            backgroundPosition="center"
        >
            <Navbar />
            <div
                css={{
                    gridArea: 'main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper 
                    elevation={3}
                    css={(theme: any) => css({
                        backgroundColor: `${theme.colors.dark} !important`,
                        maxWidth: '600px',
                        minWidth: '300px',
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '60px 10px',
                    })}   

                    onClick={() => setToggle(!toggle)}
                >   
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
                                color: theme.colors.text1,
                                textAlign: 'center',
                                '@media (max-width: 650px)': {
                                    fontSize: '28px',
                                }
                            })}
                            htmlFor="username"
                        >
                            what's your username ?
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
                                css={(theme: any) => ({
                                    width: '400px',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    borderBottom: `2px solid ${theme.colors.text1}`,
                                    textAlign: 'center',
                                    paddingBottom: '15px',
                                    letterSpacing: '3px',
                                    fontSize: '24px',
                                    color: theme.colors.text1,
                                    fontFamily: 'Audiowide, cursive',
                                    '@media (max-width: 550px)': {
                                        fontSize: '18px',
                                        width: '250px'
                                    },
                                })}
                            />
                        </div>
                        {error && 
                            <p
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
                </Paper>
            </div>
        </PageContainer>
    )
}

export default Landing