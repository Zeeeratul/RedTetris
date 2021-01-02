/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useReducer, useState, useEffect, useContext } from 'react'
import _ from 'lodash'
import Grid from '../components/game/Grid'
import LittleGridSpectrum from '../components/game/LittleGridSpectrum'
import { Navbar, Footer, Main, PageContainer } from '../components/Template'
import { emitToEvent, subscribeToEvent } from '../middlewares/socket'
import { ButtonWithIcon } from '../components/Buttons'
import { useHistory } from "react-router-dom"
import { SOCKET } from '../config/constants.json'
import { UserContext } from '../utils/userContext'

const regex = new RegExp('^#[a-zA-Z0-9]*$')

interface GameInfo {
    name: string;
    status: string;
    players: any[];
    maxPlayers: number;
    mode: string;
    speed: number;
    isLeader: boolean;
}

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

const reducer = (gameInfo: GameInfo, action: any) => {

    switch (action.type) {
        case SOCKET.GAMES.INFO: 
            return {
                ...gameInfo,
                ...action.payload
            }
        default:
            return gameInfo
    }
}

function Game() {

    const user = useContext(UserContext)

    const history = useHistory()
    // const [state, dispatch] = useReducer(reducer, initialState)
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
        // emitToEvent(SOCKET.GAMES.LEAVE)
        history.push('/games')
    }

    return (
        <PageContainer>
            <Navbar />
            {status === 'idle' &&
                <Main>
                    <div>
                        {players.map((player: any) => {
                            return <p key={`player_${player.username}`}>{player.username}</p>
                        })}
                    </div>
                    {isLeader &&
                        <ButtonWithIcon
                            onClick={startGame}
                        >
                            Start
                        </ButtonWithIcon>
                    }
                    <ButtonWithIcon
                        onClick={leaveGame}
                    >
                        Leave
                    </ButtonWithIcon>
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
                        <ButtonWithIcon
                            onClick={startGame}
                        >
                            Restart
                        </ButtonWithIcon>
                    }
                    <ButtonWithIcon
                        onClick={leaveGame}
                    >
                        Leave
                    </ButtonWithIcon>
                </Main>
            }
            <Footer />
        </PageContainer>  
    )
}

export default Game
