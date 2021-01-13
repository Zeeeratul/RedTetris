/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect, useContext } from 'react'
import _ from 'lodash'
import { cancelSubscribtionToEvent, emitToEvent, subscribeToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { Navbar, PageContainer } from '../components/Template'
import { SOCKET } from '../config/constants.json'
import { UserContext } from '../utils/userContext'

// Started Game
import Grid from '../components/startedGame/Grid'
import LittleGridSpectrum from '../components/startedGame/LittleGridSpectrum'

// Idle Game
import GameInfo from '../components/idleGame/GameInfo'
import Leaderboard from '../components/idleGame/Leaderboard'
import Chat from '../components/idleGame/Chat'

import background from '../assets/tetris-background.jpg'

const initialState = {
    name: '',
    players: [],
    maxPlayers: 2,
    mode: 'classic',
    speed: 1,
    leaderId: '',
    status: 'idle',
}

function Game() {

    const [state, setState] = useState(initialState)
    const { name, status, leaderId, players, maxPlayers, speed, mode } = state
    const { id: userId } = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        emitToEvent(SOCKET.GAMES.GET_INFO)

        subscribeToEvent(SOCKET.GAMES.GET_INFO, (error, data) => {
            if (error) {
                if (error === SOCKET.GAMES.ERROR.NOT_FOUND)
                    history.replace('/games')
            }
            else {
                setState(data)
            }
        })

        return () => {
            cancelSubscribtionToEvent(SOCKET.GAMES.GET_INFO)
            emitToEvent(SOCKET.GAMES.LEAVE)
        }
    }, [history])

    const startGame = () => {
        emitToEvent(SOCKET.GAMES.START)
    }

    return (
        <PageContainer
            backgroundImage={`url(${background})`}
            backgroundPosition="center"
        >
            <Navbar userConnected userInGame />
                {(status === 'idle' || status === 'ended') && (
                    <div
                        css={{
                            gridArea: 'main',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        <GameInfo 
                            gameName={maxPlayers === 1 ? "" : name}
                            speed={speed} 
                            maxPlayers={maxPlayers} 
                            mode={mode} 
                            players={players} 
                            isLeader={userId === leaderId}
                            startGame={startGame}
                        />
                        <Leaderboard />
                        {maxPlayers > 1 &&
                            <Chat />
                        }
                    </div>
                )}
                {status === 'started' &&
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
                        <Grid speed={speed} mode={mode} />

                        {_.filter(players, (o: any) => o.id !== userId).map((player: any, index: number) => (
                            <LittleGridSpectrum
                                key={`little_grid_${player.id}`}
                                spectrum={player.spectrum}
                                position={index}
                                playerStatus={player.status}
                            />
                        ))}
                    </div>
                }
        </PageContainer>  
    )
}

export default Game