/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useReducer, useState, useEffect, useContext } from 'react'
import _ from 'lodash'
import Grid from '../components/game/Grid'
import LittleGridSpectrum from '../components/game/LittleGridSpectrum'
import { Navbar, Footer, Main, PageContainer } from '../components/Template'
import { emitToEvent, subscribeToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { SOCKET } from '../config/constants.json'
import { UserContext } from '../utils/userContext'
import { Button } from '../components/Button'
import background from '../assets/background.jpg'

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
    const { winner, status, leaderId, players } = state

    const isLeader = user.id === leaderId

    useEffect(() => {

        // on mount get game info
        emitToEvent(SOCKET.GAMES.GET_INFO)

        subscribeToEvent(SOCKET.GAMES.GET_INFO, (error, data) => {
            if (!error) {
                setState(data)
                // dispatch({ type: SOCKET.GAMES.INFO, payload: data })
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

    return (
        <PageContainer
            backgroundImage={`url(${background})`}
            backgroundPosition="center"
        >
            <Navbar />
            <Main
                // css={{
                //     display: 'grid',
                //     gridTemplateColumns: '1fr 2fr 1fr',
                //     gridTemplateRows: "1fr 1fr 50px",
                //     // gridTemplateRows: 'auto auto 50px',
                //     // gridTemplateAreas: `
                //     //     "little_grid_1 main_grid little_grid_2"
                //     //     "little_grid_3 main_grid little_grid_4"
                //     // `
                // }}
            >
                <div
                    css={{
                        background: 'red',
                        height: '100px',
                        width: '100%',
                        flex: 1,
                        alignSelf: 'stretch'
                    }}
                >

                </div>
 
                {/* <Button
                    title="Start"
                    action={startGame}
                />
                <Button
                    title="Leave"
                    action={leaveGame}
                /> */}
            </Main>
            {/* {status === 'idle' &&
                <Main>
                    <div>
                        {players.map((player: any) => {
                            return <p key={`player_${player.username}`}>{player.username}</p>
                        })}
                    </div>
                    {isLeader &&
                        <button
                            onClick={startGame}
                        >
                            Start
                        </button>
                    }
                    <button
                        onClick={leaveGame}
                    >
                        Leave
                    </button>
                </Main>
            }
            {status === 'started' &&
                <Main
                    css={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1fr',
                        gridTemplateRows: '50% 50%',
                        gridTemplateAreas: `
                            "little_grid_1 main_grid little_grid_2"
                            "little_grid_3 main_grid little_grid_4"
                        `
                    }}
                >
                    <Grid />

                    {_.filter(players, (o: any) => o.id !== user.id).map((player: any, index: number) => (
                        <LittleGridSpectrum
                            key={`${player.id}`}
                            spectrum={player.spectrum}
                            position={index}
                            playerStatus={player.status}
                        />
                    ))}
                </Main>
            }
            {status === 'ended' &&
                <Main>
                    <p>{winner} wins the game</p>
                    {isLeader &&
                        <button
                            onClick={startGame}
                        >
                            Restart
                        </button>
                    }
                    <button
                        onClick={leaveGame}
                    >
                        Leave
                    </button>
                </Main>
            } */}
        </PageContainer>  
    )
}

export default Game
