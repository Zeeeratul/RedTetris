/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useState, useEffect, useContext } from 'react'
import { emitToEventWithAcknowledgement } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { Navbar, Main, PageContainer } from '../components/Template'
import { Button } from '../components/Button'
import { SOCKET } from '../config/constants.json'


import { CreateGameModal } from '../components/gamesList/CreateGameModal'

import { UserContext } from '../utils/userContext'

import styled from '@emotion/styled'

// styling to DO
// - button CREATE AND SOLO PLAYING
// - modal of creating a game 
// - list of join games


// create game (input + button) Or 
// modal where you have (game name) (game speed) (game mode) (max players)


// solo game ??
// list games and join them


const GamesList = () => {

    const user = useContext(UserContext)

    const [showModal, setShowModal] = useState(false)

    const history = useHistory()
    const [games, setGames] = useState([])

    const [gameCreation, setGameCreation] = useState({
        error: '',
        name: ''
    })

    const createGame = () => {
        if (!gameCreation.name) return 
        emitToEventWithAcknowledgement(SOCKET.GAMES.CREATE, { name: gameCreation.name }, (error: any, gameName: string) => {
            if (error)
                setGameCreation({
                    error,
                    name: ''
                })
            else {
                history.push(`/game/${gameName}`)
            }
        })
    }

    const joinGame = (gameNameJoin: string) => {
        if (!gameNameJoin) return 
        emitToEventWithAcknowledgement(SOCKET.GAMES.JOIN, gameNameJoin, (error: any, gameName: string) => {
            if (error) {
                console.error(error)
            }
            else {
                history.push(`/game/${gameName}`)
            }
        })
    }

    useEffect(() => {
        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_GAMES, {}, (error, games) => {
            setGames(games)
        })

        const intervalId = setInterval(() => {
            emitToEventWithAcknowledgement(SOCKET.GAMES.GET_GAMES, {}, (error, games) => {
                setGames(games)
            })
        }, 3000)
        
        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return (
        <PageContainer >
            <Navbar />
                
            <Main>
                <Button title="Create" action={() => setShowModal(!showModal)} />
                <CreateGameModal isOpen={showModal} close={() => setShowModal(false)} />
                {/* <button>Play Solo</button> */}
                {/* <div id="games_list">
                    {/* <h1>Games list</h1>
                    {games.map((game : any) => (
                        <p
                            key={game.name}   
                            onClick={() => joinGame(game.name)}                     
                        >
                            {game.name}
                        </p>
                    ))}
                </div>

                <Columm>
                    <h1>Create game</h1>
                    <p>
                        {gameCreation?.error}
                    </p>

                    <div
                        css={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '80%'
                        }}
                    >
                        <input
                            id="search-game"
                            name="game_name"
                            placeholder="Create your game..."
                            maxLength={15}
                            css={{
                                minWidth: '250px',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                borderBottom: '2px solid white',
                                paddingBottom: '15px',
                                fontSize: '18px',
                                color: 'white',
                            }}
                            onChange={(ev) => setGameCreation({
                                name: ev.target.value,
                                error: ''
                            })}
                            value={gameCreation.name}
                        />
                        <button
                            css={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={createGame}
                        >
                            <CreateIcon
                                fontSize="large"
                                css={{
                                    color: "white",
                                    opacity: '0.75',
                                    marginLeft: '10px',
                                    '&:hover': {
                                        opacity: '1',
                                        transition: '400ms ease'
                                    },
                                    '&:active': {
                                        color: 'grey'
                                    }
                                }}
                            />
                        </button>
                    </div>

                </Columm> */}

            </Main>

            {/* <Footer /> */}
            
        </PageContainer>
    )
}
    
export default GamesList