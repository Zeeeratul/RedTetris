/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useState, useEffect } from 'react'
import { emitToEventWithAcknowledgement } from '../../middlewares/socket'
import { useHistory } from "react-router-dom"
import { SOCKET } from '../../config/constants.json'
import { useInterval } from '../../utils/useInterval'

const errorMessages: { [index: string] : string } = {
    [SOCKET.GAMES.ERROR.NOT_FOUND]: "Sorry this is game doesn't exist",
    [SOCKET.GAMES.ERROR.STARTED]: "Sorry this game has already started",
    [SOCKET.GAMES.ERROR.FULL]: "Sorry this game is full",
}

const speedToText: { [index: number] : string } = {
    2: 'Slow',
    1.5: 'Classic',
    1: 'Fast',
    0.5: 'Ultra Fast',
}

const modeToText: { [index: string] : string } = {
    "classic": 'Classic',
    "invisible": 'Invisible',
    "marathon": 'Marathon',
}

const GamesListTable = () => {

    const [joinError, setJoinError] = useState('')
    const [games, setGames] = useState([])
    const history = useHistory()

    const getGames = () => {
        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_GAMES, {}, (error, games) => {
            if (!error && games) 
                setGames(games)
        })
    }

    const joinGame = (gameNameJoin: string) => {
        if (!gameNameJoin) return 
        emitToEventWithAcknowledgement(SOCKET.GAMES.JOIN, gameNameJoin, (error, gameName) => {
            if (error) {
                setJoinError(error)
                getGames()
            }
            else {
                history.push(`/game/${gameName}`)
            }
        })
    }

    useEffect(() => {
        getGames()
        const timeoutId = setTimeout(() => {
            setJoinError('')
        }, 4000)
        
        return () => clearTimeout(timeoutId)
    }, [joinError])

    useInterval(() => getGames(), 5000)

    return (
        <div
            css={{
                display: 'flex',
                minHeight: '250px',
                height: '80%',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 2,
                '@media (max-width: 650px)': {
                    width: '100%',
                }
            }}
        >
            <h1
                css={(theme: any) => ({
                    color: theme.colors.text2,
                    textAlign: 'center'
                })}
            >
                Join game
            </h1>
            {joinError && 
                <p
                    css={{
                        color: 'red',
                        fontSize: '22px'
                    }}
                >
                    {errorMessages[joinError]}
                </p>
            }
            <div
                css={{
                    maxHeight: '400px !important',
                    overflowY: 'scroll',
                    borderRadius: '10px',
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'white',
                }}
            >
                <div
                    id="table-header"
                    css={(theme: any) => ({
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '5px 20px',
                        color: 'red',
                        borderBottom: `1px solid ${theme.colors.lightGrey}`
                    })}
                >
                    <div css={{ flex: 2 }}>
                        <p>Game Name</p>
                    </div>
                    <div css={{ flex: 1 }}>
                        <p>Slots</p>
                    </div>
                    <div css={{ flex: 1 }}>
                        <p>Mode</p>
                    </div>
                    <div css={{ flex: 1 }}>
                        <p>Speed</p>
                    </div>
                </div>
                {games.length > 0 ?
                    games.map((game: Game) => (
                        <div
                            key={`game-list-${game.name}`}
                            css={(theme: any) => ({
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '14px',
                                padding: '5px 20px',
                                borderBottom: `1px solid ${theme.colors.lightGrey}`,
                                '&:hover': {
                                    backgroundColor: theme.colors.lightGrey,
                                    transition: '200ms ease-out',
                                }
                            })}
                            onClick={() => joinGame(game.name)}
                        >
                            <div css={{ flex: 2 }}>
                                <p>{game.name}</p>
                            </div>
                            <div css={{ flex: 1 }}>
                                <p>{game.players.length} / {game.maxPlayers}</p>
                            </div>
                            <div css={{ flex: 1 }}>
                                <p>{modeToText[game.mode]}</p>
                            </div>
                            <div css={{ flex: 1 }}>
                                <p>{speedToText[game.speed]}</p>
                            </div>
                        </div>
                    ))
                    :
                    (
                    <div
                        css={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <p>No game</p>
                    </div>
                    )
                }
            </div>
        </div>
    )
}
    
export default GamesListTable