/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { initiateSocket, emitToEventWithAcknowledgement,
subscribeToEvent } from '../middlewares/socket'
import { SOCKET } from '../config/constants.json'
import { PageContainer } from '../components/PageContainer'
import { Navbar } from '../components/Navbar'
import { Paper } from '@material-ui/core'
import LoginForm from '../components/landing/LoginForm'
import background from '../assets/tetris-background.jpg'

function Landing({ setUser }: { setUser: React.Dispatch<React.SetStateAction<{
    username: string;
    id: string;
}>> }) {
    
    const history = useHistory()
    const [error, setError] = useState('')
    useEffect(() => {
        initiateSocket()
    }, [])

    const handleSubmit = (username: string) => {
        if (username) {
            emitToEventWithAcknowledgement(SOCKET.AUTH.LOGIN, username, (error, data) => {
                if (error) {
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
                {error}
                <Paper 
                    elevation={3}
                    css={(theme: any) => css({
                        backgroundColor: `${theme?.colors?.dark} !important`,
                        maxWidth: '600px',
                        minWidth: '300px',
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '60px 10px',
                    })}   
                >   
                    <LoginForm onSubmit={handleSubmit} error={error} />
                </Paper>
            </div>
        </PageContainer>
    )
}

export default Landing