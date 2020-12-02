import React, { useState, useEffect } from 'react'
import { initiateSocket, disconnectUser, subscribeToEvent, emitToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"

const GamesList = () => {

    const history = useHistory()
    const [gameName, setRoomName] = useState('')
    const [games, setGames] = useState([])

    useEffect(() => {
        initiateSocket()

        emitToEvent('get_games', '', ({ games }) => {
            setGames(games)
        })

        const timeoutRef = setInterval(() => {
            emitToEvent('get_games', '', ({ games }) => {
                setGames(games)
            })
        }, 5000)

        return () => clearInterval(timeoutRef)
    }, [])

    const createGame = () => {
        emitToEvent('create', gameName, ({ error, url }) => {
            if (error) {
                console.log(error)
            }
            else {
                history.push(`/${url}`)
            }
        })
        setRoomName('')
    }

    const joinGame = (gameName) => {
        emitToEvent('join', gameName, ({ error, url }) => {
            if (error) {
                console.log(error)
            }
            else {
                history.push(`/${url}`)
            }
        })
    }
    
    return (
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <button onClick={() => disconnectUser()}>Disconnect</button>
            <div className="games_list">
                {games.map((game) => (
                    <p key={`game_${game.name}`} onClick={() => joinGame(game.name)}>Join this game: {game.name}</p>
                ))}
            </div>

            <div className="create_game" style={{ display: "flex", flexDirection: "column" }}>
                <input placeholder="Create your own game" value={gameName} name="room" onChange={ev => setRoomName(ev.target.value)} />
                <button onClick={createGame}>Create game</button>
                
            </div>
        </div>
    )
}

export default GamesList
