import React, { useContext, useState } from 'react'
import { ThemeContext } from '../utils/useTheme'
import '../styles/Game.css'

// const regex = new RegExp('^#[a-zA-Z0-9]*[[a-zA-Z0-9]*]$')

function Game() {

    const { theme } = useContext(ThemeContext)

    const [gameStatus, setGameStatus] = useState('started')
  
    return (
        <div className="full_page">
            <div className="game_container">
                <div className="grid">
                    grid card
                </div>
            </div>

            <div className="little_grids_container">
                Grid other players
            </div>

            <div>
                New piece +
                Leave game
            </div>

        </div>
    )
}

export default Game
