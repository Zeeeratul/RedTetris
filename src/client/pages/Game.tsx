/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect, useContext, Fragment } from 'react'
import _ from 'lodash'
import Grid from '../components/game/Grid'
import LittleGridSpectrum from '../components/game/LittleGridSpectrum'
import { Navbar, PageContainer } from '../components/Template'
import { emitToEvent, subscribeToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { SOCKET } from '../config/constants.json'
import { UserContext } from '../utils/userContext'
import { Button } from '../components/Button'
import background from '../assets/tetris-background.jpg'
import { Paper } from '@material-ui/core'
import { useInterval } from '../utils/useInterval'
import IdleGame from '../components/game/IdleGame'
import StartedGame from '../components/game/StartedGame'
import EndedGame from '../components/game/EndedGame'

const initialState = {
    name: '',
    players: [],
    maxPlayers: 2,
    mode: 'classic',
    speed: 1,
    isLeader: false,
    leaderId: '',
    status: 'idle',
    winner: ''
}

// game status
// 'idle'
// - Start / Leave Buttons
// - List players
// - Chat maybe

// 'playing'
// - grid
// - littlte grid
// - leave Button

// 'ended' 
// - score of each player
// - restart / leave button

function Game() {

    const user = useContext(UserContext)
    const history = useHistory()
    const [state, setState] = useState(initialState)
    // const { winner, status, leaderId, players } = state
    const { winner, status, leaderId, players } = state
    const isLeader = user.id === leaderId

    useEffect(() => {

        // on mount get game info
        emitToEvent(SOCKET.GAMES.GET_INFO)

        subscribeToEvent(SOCKET.GAMES.GET_INFO, (error, data) => {
            if (!error) {
                setState(data)
            }
            else console.error(error)
        })

        return () => emitToEvent(SOCKET.GAMES.LEAVE)
    }, [])

    const startGame = () => {
        emitToEvent(SOCKET.GAMES.START)
    }

    const leaveGame = () => {
        history.push('/games')
    }

    const setStatusToIdle = () => {
        setState({
            ...state,
            status: 'idle'
        })
    }

    return (
        <PageContainer
            backgroundImage={`url(${background})`}
            backgroundPosition="center"
        >
            <Navbar userConnected userInGame />
            <div
                css={{
                    gridArea: 'main',
                    display: 'grid',
                    gridTemplateColumns: '28% auto 28%',
                    gridTemplateRows: 'auto auto',
                    gridTemplateAreas: `
                        "little_grid_1 main_grid little_grid_2"
                        "little_grid_3 main_grid little_grid_4"
                    `
                }}
            >
                {status === 'idle' && 
                    <IdleGame />
                }
                {status === 'started' &&
                    <StartedGame players={players} />
                }
                {status === 'ended' &&
                    <EndedGame setStatusToIdle={setStatusToIdle} />
                }
            </div>

            <footer
                id="footer"
                css={{
                    gridArea: 'footer',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}
            >
                <Button 
                    title="Lobby"
                    action={leaveGame} 
                />
                {isLeader && status !== 'started' &&
                    <Button 
                        title={status === 'idle' ? "Start" : "Restart"}
                        action={startGame} 
                    />
                }
                {/* <Button 
                    title="Leave"
                    action={leaveGame} 
                /> */}
   
            </footer>
        </PageContainer>  
    )
}

export default Game
