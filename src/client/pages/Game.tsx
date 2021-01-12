/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect, useContext, Fragment } from 'react'
import _ from 'lodash'
import { Navbar, PageContainer } from '../components/Template'
import { cancelSubscribtionToEvent, emitToEvent, subscribeToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { SOCKET } from '../config/constants.json'
import { UserContext } from '../utils/userContext'
import { Button } from '../components/Button'
import background from '../assets/tetris-background.jpg'
import IdleGame from '../components/game/IdleGame'
import EndedGame from '../components/game/EndedGame'
import Grid from '../components/game/Grid'
import LittleGridSpectrum from '../components/game/LittleGridSpectrum'
import styled from '@emotion/styled/macro'


const initialState = {
    name: '',
    players: [],
    maxPlayers: 2,
    mode: 'classic',
    speed: 1,
    leaderId: '',
    status: 'idle',
}

const NoMarginButton = styled(Button)`
  margin-top: 0px;
  margin-bottom: 0px;
`

function Game() {

    const { id: userId } = useContext(UserContext)
    const history = useHistory()
    const [state, setState] = useState(initialState)
    const [results, setResults] = useState(null)
    const { status, leaderId, players, maxPlayers, speed, mode } = state
    const isLeader = userId === leaderId

    useEffect(() => {
        console.log('recall')
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

        subscribeToEvent(SOCKET.GAMES.RESULTS, (error, results) => {
            if (error) {
            }
            else {
                setResults(results)
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

    const leaveGame = () => {
        history.replace('/games')
    }

    const resetResults = () => setResults(null)

    // useEffect(() => {
    //     console.log('results have changed')
    // }, [results])

    // const  = () => {
    //     setState({
    //         ...state,
    //         results: null
    //     })
    // }

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
                {status === 'idle' && !results &&
                    <IdleGame players={players} isSoloGame={maxPlayers === 1} speed={speed} mode={mode} />
                }
                {status === 'idle' && results &&
                    <EndedGame results={results} resetResults={resetResults} />
                }
                {status === 'started' &&
                    <Fragment>
                        <Grid speed={speed} mode={mode} />

                        {_.filter(players, (o: any) => o.id !== userId).map((player: any, index: number) => (
                            <LittleGridSpectrum
                                key={`little_grid_${player.id}`}
                                spectrum={player.spectrum}
                                position={index}
                                playerStatus={player.status}
                            />
                        ))}
                    </Fragment>
                }
                {/* {status === 'idle' && results &&
                    <EndedGame results={results} resetResults={setResults(null)} />
                } */}
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
                {status === 'idle' && results &&
                    <NoMarginButton 
                        title="Lobby"
                        action={resetResults} 
                    />
                }
                {isLeader && status !== 'started' &&
                    <NoMarginButton 
                        title={status === 'idle' ? "Start" : "Restart"}
                        action={startGame} 
                    />
                }
                <NoMarginButton 
                    title="Leave"
                    action={leaveGame} 
                />
   
            </footer>
        </PageContainer>  
    )
}

export default Game
