import React, { useContext, useState } from 'react'
import { ThemeContext } from '../utils/useTheme'
import '../styles/Game.css'
import Grid from '../components/game/Grid'

// const regex = new RegExp('^#[a-zA-Z0-9]*[[a-zA-Z0-9]*]$')

function Game() {

    const { theme } = useContext(ThemeContext)

    const [gameStatus, setGameStatus] = useState('started')
  
    return (
        <div className="full_page">
            <div className="card">
                <Grid />
            </div>
            <div className="card little">

            </div>
            <div className="card">

            </div>
      

        </div>
    )
}

export default Game
