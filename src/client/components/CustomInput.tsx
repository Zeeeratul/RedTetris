import React, { useState, useEffect, useContext } from 'react'
import '../styles/GamesList.css'
import SearchIcon from '@material-ui/icons/Search'

const CustomInput = () => {

    return (
        <div className="input_group">
            <input
                name="game_name"
                placeholder="Search your game..."
                maxLength={15}
            />
            <button><SearchIcon/></button>
        </div>
    )
}

export default CustomInput
