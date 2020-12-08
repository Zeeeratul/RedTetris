import React, { useState, useEffect, useContext } from 'react'
import '../styles/GamesList.css'
import { ThemeContext } from '../utils/useTheme'
import Navbar from '../components/navbar/Navbar'
import TableGames from '../components/TableGames'
import CreateGame from '../components/CreateGame'

const GamesList = () => {

    const { theme } = useContext(ThemeContext)

    return (
        <div className={`page ${theme}`}>
            {/* <Navbar /> */}
            <div className="games_list_container">
                <TableGames />
                <CreateGame />
            </div>
        </div>
    )
}

export default GamesList
