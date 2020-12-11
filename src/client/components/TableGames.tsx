import React, { useState, useEffect, useContext } from 'react'
import '../styles/GamesList.css'
import { initiateSocket, subscribeToEvent, emitToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import CustomInput from './CustomInput'
import SearchIcon from '@material-ui/icons/Search'

const TableGames = () => {

    const [searchGameName, setSearchGameName] = useState('')
    const [games, setGames] = useState([])
    const history = useHistory()

    // useEffect(() => {
    //     emitToEvent('get_games', {}, (res: any) => {
    //         console.log(res)
    //         setGames(res.games || [])
    //     })

    //     const intervalId = setInterval(() => {
    //         emitToEvent('get_games', {}, (res: any) => {
    //             setGames(res.games || [])
    //         })
    //     }, 5000)

    //     return () => clearInterval(intervalId)
    // }, [])

    const joinGame = (game_name: string) => {
        emitToEvent('join', game_name, (res) => {
            console.log(res)
        })
    }

    return (
        <div className="center_container">
            {/* <CustomInput /> */}
            <table>
                <thead>
                    <tr>
                        <th> Game Name </th>
                        <th> Players </th>
                    </tr>
                </thead>
                <tbody>
                    {games.length > 0 ?
                        games.map((game: { name: string, players: number }) => (
                            <tr key={`game_${game.name}`} onClick={() => joinGame(game.name)}>
                                <td>{game.name}</td>
                                <td>{game.players}/2</td>
                            </tr>
                        ))
                    :
                    <tr>
                        <td colSpan={2}>No games</td>
                     </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TableGames
