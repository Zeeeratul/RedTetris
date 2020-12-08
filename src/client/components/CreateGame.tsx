import React, { useState, useEffect, useContext } from 'react'
import '../styles/GamesList.css'
import { initiateSocket, subscribeToEvent, emitToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { ThemeContext } from '../utils/useTheme'
import CustomInput from './CustomInput'
import SearchIcon from '@material-ui/icons/Search'

const CreateGame = () => {

    const history = useHistory()

    const createGame = (gameName: string) => {
        emitToEvent('create', gameName, (res: any) => {
            console.log(res)
        })
    }

    return (
        <div className="center_container">
            <h3>Create Your game</h3>
            <CustomInput placeholder="Create your game" onSubmit={createGame} />
            <hr></hr>
            <button>Play solo</button>
        </div>
    )
}

export default CreateGame
