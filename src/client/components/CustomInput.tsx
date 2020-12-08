import React, { useState } from 'react'
import '../styles/GamesList.css'
import SearchIcon from '@material-ui/icons/Search'

type CustomInputProps = {
    onSubmit: (input: string) => void,
    placeholder?: string
}

const CustomInput = ({ onSubmit, placeholder }: CustomInputProps) => {

    const [state, setState] = useState('')

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setState(ev.target.value)
    }

    const handleSubmit = () => {
        onSubmit(state)
    }

    return (
        <div className="input_group">
            <input
                name="game_name"
                placeholder={placeholder}
                maxLength={15}
                onChange={handleChange}
            />
            <button onClick={() => handleSubmit()}><SearchIcon/></button>
        </div>
    )
}

export default CustomInput
