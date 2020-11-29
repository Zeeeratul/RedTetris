import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from "react-router-dom"
import { initiateSocket, disconnectSocket, disconnectUser, checkConnection, subscribeToEvent, emitToEvent } from '../middlewares/socket'
import GameGrid from './game/Grid';

const regex = new RegExp('^#[a-zA-Z0-9]*[[a-zA-Z0-9]*]$')

function Game() {

    const location = useLocation()
    const history = useHistory()
    const [players, setPlayers] = useState([])
    const [leader, setLeader] = useState(false)
    const [gameStart, setGameStart] = useState(false)

    useEffect(() => {
        let hashUrl = location.hash
        if (!regex.test(hashUrl))
            history.push('/landing')
    }, [location, history])

    useEffect(() => {
        emitToEvent('is_leader')

        subscribeToEvent('is_leader', ({ isLeader }) => {
            setLeader(isLeader)
        })

        subscribeToEvent('start_game', () => {
            setGameStart(true)
        })

        subscribeToEvent('leave_game', ({ information }) => {
            emitToEvent('is_leader')
        })
    }, [])

    const leaveGame = () => {
        emitToEvent('leave_game')
        history.push('/games-list')
    }

    const startGame = () => {
        emitToEvent('start_game')
    }

    return (
        <div>
            <button onClick={() => disconnectUser()}>Disconnect</button>
            <button onClick={() => leaveGame()}>leaveGame</button>

            {leader ? 
                <button onClick={() => startGame()}>startGame</button>
            : null}
            {/* <div>
                <h1>Players:</h1>
                <ul>
                    {players.map((player) => (
                        <li key={`player_${player}`}>{player}</li>
                    ))}
                </ul>
            </div> */}

            {gameStart ?
                <GameGrid />
            :
                <p>not yet start</p>
            }
        </div>
    )
}

export default Game
