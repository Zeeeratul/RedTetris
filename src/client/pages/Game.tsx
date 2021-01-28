/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useState, useEffect, useContext } from 'react'
import _ from 'lodash'
import { cancelSubscribtionToEvent, emitToEvent, subscribeToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { PageContainer } from '../components/PageContainer'
import { Navbar } from '../components/Navbar'
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

const defautGameParameters: Game = {
    leaderId: '',
    maxPlayers: 2,
    status: 'idle',
    speed: 1,
    mode: 'classic',
    name: '',
    players: [],
}


function Game() {
    const [gameParameters, setGameParameters] = useState(defautGameParameters)
    const [results, setResults] = useState([])
    const { name, status, leaderId, players, maxPlayers, speed, mode } = gameParameters
    const { id: userId } = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        emitToEvent(SOCKET.GAMES.GET_INFO)

        subscribeToEvent(SOCKET.GAMES.GET_INFO, (error, data) => {
            if (error) {
                if (error === SOCKET.GAMES.ERROR.NOT_FOUND)
                    history.replace('/games')
            }
            else
                setGameParameters(data)
        })

        subscribeToEvent(SOCKET.GAMES.RESULTS, (error, results) => {
            if (error) {
            }
            else
                setResults(results)
        })

        return () => {
            cancelSubscribtionToEvent(SOCKET.GAMES.GET_INFO)
            cancelSubscribtionToEvent(SOCKET.GAMES.RESULTS)
            emitToEvent(SOCKET.GAMES.LEAVE)
        }
    }, [history])

    const startGame = () => emitToEvent(SOCKET.GAMES.START)

    return (
        <PageContainer
            backgroundImage={`url(${background})`}
            backgroundPosition="center"
        >
            <Navbar userConnected userInGame />
                {status === 'idle' && (
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
                        {results.length > 0 &&
                            <Leaderboard results={results} />
                        }
                        {maxPlayers > 1 &&
                            <Chat />
                        }
                    </div>
                )}
                {status === 'started' && (
                    <div
                        css={{
                            gridArea: 'main',
                            display: 'grid',
                            gridTemplateColumns: 'auto auto auto',
                            gridTemplateRows: 'auto auto',
                            gridTemplateAreas: `
                                "little_grid_1 main_grid little_grid_2"
                                "little_grid_3 main_grid little_grid_4"
                            `,
                            '@media (max-width: 800px)': {
                                gridTemplateColumns: '1fr 1fr',
                                gridTemplateRows: '2fr auto auto',
                                gridTemplateAreas: `
                                    "main_grid main_grid"
                                    "little_grid_1 little_grid_2"
                                    "little_grid_3 little_grid_4"
                                `,
                            }
                        }}
                    >
                        <Grid speed={speed} mode={mode} />
                        {_.filter(players, (o: Player) => o.id !== userId)
                            .map((player: Player, index: number) => (
                                <LittleGridSpectrum
                                    key={`little_grid_${player.id}`}
                                    player={player}
                                    gridPosition={index}
                                />
                            ))
                        }
                    </div>
                )}
        </PageContainer>  
    )
}

export default Game