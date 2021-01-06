/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect, useContext } from 'react'
import { emitToEventWithAcknowledgement } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { SOCKET } from '../config/constants.json'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'
import { Button } from '../components/Button'
import { CreateGameModal } from '../components/gamesList/CreateGameModal'
import { Navbar, Main, PageContainer } from '../components/Template'
import { UserContext } from '../utils/userContext'
import background from '../assets/background.jpg'

// styling to DO
// - list of join games


// list games and join them

const useStyles = makeStyles({
    container: {
        maxWidth: 600,
    },
    paper: {

    }
})

const GamesList = () => {

    const tableClasses = useStyles()
    const [showModal, setShowModal] = useState(false)
    const [isMultiplayer, setIsMultiplayer] = useState(true)
    const history = useHistory()
    const [games, setGames] = useState([
        {
            maxPlayers: 2,
            players: ['', ''],
            mode: "classic",
            name: "test",
            speed: 1,
        }
    ])

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
        
        return () => clearInterval(intervalId)
    }, [])

    return (
        <PageContainer
            backgroundImage={`url(${background})`}
            backgroundPosition="center"
        >
            <CreateGameModal 
                isOpen={showModal}  
                isMultiplayer={isMultiplayer}    
                close={() => {
                    // reset default
                    setShowModal(false)
                    setIsMultiplayer(true)
                }}
            />
            <Navbar />
                
            <Main>
                <div
                    css={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 2
                    }}
                >
                <Paper elevation={3}
                    css={css({
                        width: '600px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        backgroundColor: '#303030',
                    })}    
                >
                    <h2>Join game</h2>
                    <TableContainer 
                        component={Paper}
                        className={tableClasses.container}
                    >
                        <Table aria-label="games-list-table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Game Name</TableCell>
                                <TableCell align="right">Slots</TableCell>
                                <TableCell align="right">Mode</TableCell>
                                <TableCell align="right">Speed</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {games.length > 0 ?
                                games.map((game) => (
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
                                        <TableCell align="right">{game.players.length} / {game.maxPlayers}</TableCell>
                                        <TableCell align="right">{game.mode}</TableCell>
                                        <TableCell align="right">{game.speed}</TableCell>
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
                    </TableContainer>
                </Paper>
                </div>

                <div
                    css={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Button 
                        title="Create game" 
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
            </Main>
        </PageContainer>
    )
}
    
export default GamesList