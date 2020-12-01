import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from "react-router-dom"
import { initiateSocket, disconnectSocket, disconnectUser, checkConnection, subscribeToEvent, emitToEvent } from '../middlewares/socket'
import GameGrid from './game/Grid';

const regex = new RegExp('^#[a-zA-Z0-9]*[[a-zA-Z0-9]*]$')

function Game() {

    const location = useLocation()
    const history = useHistory()
    const [leader, setLeader] = useState(false)
    const [gameStatus, setGameStatus] = useState('waiting for start')

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

        subscribeToEvent('stop_game', ({ looser }) => {
            setGameStatus(`${looser} lose the game`)
        })

        subscribeToEvent('start_game', () => {
            setGameStatus('started')
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

    if (gameStatus === 'started') {
        return (
            <div>
                <button onClick={() => disconnectUser()}>Disconnect</button>
                <button onClick={() => leaveGame()}>leaveGame</button>
   
                <GameGrid />
           
            </div>
        )
    }
    else {
        return (
            <div>
                <button onClick={() => disconnectUser()}>Disconnect</button>
                <button onClick={() => leaveGame()}>leaveGame</button>
    
                {leader ? 
                    <button onClick={() => startGame()}>startGame</button>
                : null}
    
                <p>{gameStatus}</p>
            </div>
        )       
    }

  
}

export default Game
