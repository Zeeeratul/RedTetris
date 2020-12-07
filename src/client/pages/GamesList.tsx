import React, { useState, useEffect, useContext } from 'react'
import '../styles/GamesList.css'
import { initiateSocket, subscribeToEvent, emitToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { ThemeContext } from '../utils/useTheme'
import Navbar from '../components/navbar/Navbar'
import CustomInput from '../components/CustomInput'
import TableGames from '../components/TableGames'
import SearchIcon from '@material-ui/icons/Search'

const GamesList = () => {

    const [gameName, setGameName] = useState('test')
    const history = useHistory()
    const { theme, changeTheme } = useContext(ThemeContext)


    useEffect(() => {

    }, [])

    const createGame = () => {
        emitToEvent('create', gameName, (res: any) => {
            console.log(res)
        })
    }

    return (
        <>
        {/* <Navbar /> */}
        <div className={`page ${theme}`}>
            <div className="games_list_container">
                <TableGames />

                <div className="create_game_container">
                    <div className="input_group">
                        <input
                            name="game_name"
                            placeholder="Create your game..."
                            maxLength={15}
                        />
                        <button onClick={createGame}
                        ><SearchIcon/></button>

                    </div>

                </div>
            </div>
      
        </div>
        </>
    )
}

export default GamesList
