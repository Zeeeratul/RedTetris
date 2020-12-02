import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from "react-router-dom"
import { initiateSocket, disconnectSocket, disconnectUser, checkConnection, subscribeToEvent, emitToEvent } from '../middlewares/socket'
import GameGrid from './game/Grid';

// const regex = new RegExp('^#[a-zA-Z0-9]*[[a-zA-Z0-9]*]$')

function Game() {

    const location = useLocation()
    const history = useHistory()
    const [leader, setLeader] = useState(false)
    const [gameStatus, setGameStatus] = useState('idle')

    // useEffect(() => {
    //     let hashUrl = location.hash
    //     if (!regex.test(hashUrl))  {
    //         history.push('/landing')
    //     }
    // }, [location, history])

    useEffect(() => {
        emitToEvent('is_leader', '', ({ isLeader }) => {
            setLeader(isLeader)
        })

        subscribeToEvent('information', ({ type, username }) => {
            console.log(type)
            if (type === 'leave') {
                emitToEvent('is_leader', '', ({ isLeader }) => {
                    setLeader(isLeader)
                })
            }
            else if (type === 'started') {
                setGameStatus(type)
            }
            else if (type === 'lose_game') {
                console.log(`${username} lose game`)
                setGameStatus('terminated')
            }
        })

    }, [])

    const leaveGame = () => {
        emitToEvent('leave')
        history.push('/games-list')
    }

    const startGame = () => {
        emitToEvent('start')
    }


    if (gameStatus === 'started') {
        return (
            <div>
                <GameGrid />
            </div>
        )
    }

    return (
        <div>
            <button onClick={() => disconnectUser()}>Disconnect</button>
            <button onClick={() => leaveGame()}>Leave the Game</button>

            {leader ? 
                <button onClick={() => startGame()}>Start the Game</button>
            : 
            null}

            {gameStatus === 'started' ?
                <div>
                    GAME GRID !
                </div>
            :
            <p>{gameStatus}</p>
            }
  

        </div>
    )

  
}

export default Game
