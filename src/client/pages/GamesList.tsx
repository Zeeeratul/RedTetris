/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect, Fragment } from 'react'
import { emitToEventWithAcknowledgement } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { SOCKET } from '../config/constants.json'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Button } from '../components/Button'
import CreateGameModal from '../components/gamesList/CreateGameModal'
import { Navbar, PageContainer } from '../components/Template'
import { useInterval } from '../utils/useInterval'
import background from '../assets/tetris-background.jpg'

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

const GamesList = () => {

    const [showModal, setShowModal] = useState(false)
    const [isMultiplayer, setIsMultiplayer] = useState(true)
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
        emitToEventWithAcknowledgement(SOCKET.GAMES.JOIN, gameNameJoin, (error: string | null, gameName: string) => {
            if (error) {
                setJoinError(error)
                getGames()
            }
            else {
                history.replace(`/game/${gameName}`)
            }
        })
    }

    useEffect(() => {
        getGames()
        const timeoutId = setTimeout(() => {
            setJoinError('')
        }, 5000)
        
        return () => clearTimeout(timeoutId)
    }, [joinError])

    useInterval(() => getGames(), 5000)

    return (
        <Fragment>
            <CreateGameModal 
                isOpen={showModal}  
                isMultiplayer={isMultiplayer}    
                close={() => {
                    // reset default
                    setShowModal(false)
                    setIsMultiplayer(true)
                }}
            />
            <PageContainer
                backgroundImage={`url(${background})`}
                backgroundPosition="center"
            >
                <Navbar userConnected />
                <div
                    css={{
                        gridArea: 'main',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Paper elevation={3}
                        css={(theme: any) => css({
                            width: '100%',
                            maxWidth: '800px',
                            minHeight: '400px',
                            backgroundColor: `${theme.colors.dark} !important`,
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            '@media (max-width: 640px)': {
                                flexDirection: 'column',
                            }
                        })}   
                    >
                        <div
                            css={{
                                display: 'flex',
                                minHeight: '250px',
                                height: '80%',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flex: 2,
                                '@media (max-width: 640px)': {
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
                                    width: '100%',
                                }}
                            >
                                <Table 
                                    aria-label="games-list-table"
                                    css={css({
                                        background: 'white',
                                        borderRadius: '10px',
                                        overflow: 'hidden'
                                    })}
                                >
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Game Name</TableCell>
                                        <TableCell>Slots</TableCell>
                                        <TableCell>Mode</TableCell>
                                        <TableCell>Speed</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {games.length > 0 ?
                                        games.map((game: any) => (
                                            <TableRow 
                                                key={`game-list-${game.name}`}
                                                hover
                                                onClick={() => {
                                                    joinGame(game.name)
                                                }}
                                                css={css({
                                                    cursor: 'pointer'
                                                })}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {game.name}
                                                </TableCell>
                                                <TableCell>{game.players.length} / {game.maxPlayers}</TableCell>
                                                <TableCell>{modeToText[game.mode]}</TableCell>
                                                <TableCell>{speedToText[game.speed]}</TableCell>
                                            </TableRow>
                                        ))
                                        :
                                        (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">No game</TableCell>
                                        </TableRow>
                                        )
                                    }
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div
                            css={{
                                display: 'flex',
                                height: '80%',
                                minHeight: '250px',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flex: 1,
                            }}
                        >
                            <h1
                                css={(theme: any) => ({
                                    color: theme.colors.text2,
                                    textAlign: 'center'
                                })}
                            >Create game</h1>
                            <div
                                css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Button 
                                    title="Multiplayer" 
                                    action={() => {
                                        setShowModal(true)
                                        setIsMultiplayer(true)
                                    }}
                                />  
                                <Button 
                                    title="Solo"
                                    action={() => {
                                        setShowModal(true)
                                        setIsMultiplayer(false)
                                    }} 
                                />

                            </div>
                        </div>
                    </Paper>
                </div>
            </PageContainer>
        </Fragment>
    )
}
    
export default GamesList