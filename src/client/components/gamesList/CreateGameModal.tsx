/** @jsx jsx */
import { useState, useEffect } from 'react'
import { jsx, css } from '@emotion/react'
import { Modal } from '../Template'
import { MenuItem, Select, FormControl, InputLabel, TextField, createStyles } from '@material-ui/core';
import { Button } from '../Button'
import { emitToEventWithAcknowledgement } from '../../middlewares/socket';
import { SOCKET } from '../../config/constants.json'
import { useHistory } from "react-router-dom"
import { motion } from 'framer-motion'
import styled from '@emotion/styled/macro'

const defaultGameParameters = {
    name: '',
    mode: 'classic',
    speed: 1,
    maxPlayers: 2
}

const ButtonGreyBackground = styled(Button)`
    background-color: ${(props: any) => props.theme.colors.lightGrey};
`
const errorMessages: { [index: string] : string } = {
    [SOCKET.GAMES.ERROR.NAME_TAKEN]: "Game name is taken",
    [SOCKET.GAMES.ERROR.INVALID_NAME]: "Game name is invalid",
}


function CreateGameModal({ isOpen, isMultiplayer, close}: { isOpen: boolean, isMultiplayer: boolean, close: any }) {

    const history = useHistory()
    const [gameParameters, setGameParameters] = useState(defaultGameParameters)
    const [error, setError] = useState('')
    const { mode, speed, maxPlayers, name } = gameParameters

    useEffect(() => {
        setError('')
        setGameParameters(defaultGameParameters)
    }, [isOpen, isMultiplayer])

    const handleChangeName = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = ev.target.value.replace(' ', '')
        setGameParameters({ ...gameParameters, name })
        setError('')
    }

    const handleSelect = (ev: React.ChangeEvent<{
        name?: string;
        value: unknown;
    }>) => {
        const { name, value } = ev.target
        if (!name || !value) 
            return

        setGameParameters({ ...gameParameters, [name]: ev.target.value})
    }
    
    const createMultiplayerGame = () => {
        if (!gameParameters.name) return 
        emitToEventWithAcknowledgement(SOCKET.GAMES.CREATE, gameParameters, (error: any, gameName: string) => {
            if (error) {
                console.error(error)
                setError(error)
            }
            else {
                close()
                history.push(`/game/${gameName}`)
            }
        })
    }
    
    const createSoloGame = () => {
        const soloGameParameters = {
            ...gameParameters,
            isSolo: true
        }
        // setError('')
        emitToEventWithAcknowledgement(SOCKET.GAMES.CREATE, soloGameParameters, (error: any, gameName: string) => {
            if (error) {
                console.error(error)
                setError(error)
            }
            else {
                close()
                history.push(`/game/${gameName}`)
            }
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            close={close}
            width="700px"
        >
            <div
                css={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '',
                    color: 'black'
                }}
            >
                <h2
                    css={(theme: any) => ({
                        textAlign: 'center',
                        color: theme.colors.text2
                    })}
                >
                    Create your game
                </h2>
                {isMultiplayer ?
                    <div
                        css={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            minHeight: '100px'
                        }}
                    >
                        {/* Game Name */}
                        <div
                            css={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                margin: '10px 0px'
                            }}
                        >
                            <TextField 
                                css={css({
                                    width: "260px",
                                })}
                                autoFocus
                                inputProps={{ maxLength: 15 }}
                                label="Name" 
                                value={name}
                                variant="outlined"
                                onChange={handleChangeName}
                            />
                            {error &&
                                <motion.p
                                    animate={{ scale: 2 }}
                                    transition={{ duration: 0.5 }}
                                    css={{
                                        color: 'red',
                                        fontSize: '10px',
                                    }}
                                >
                                    {errorMessages[error]}
                                </motion.p>
                            }
                        </div>
                        
                        {/* Max Players */}
                        <div
                            css={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '10px 0px',
                                flexWrap: 'wrap',
                                alignSelf: error ? 'flex-start' : 'inherit'
                            }}
                        >
                            <FormControl variant="outlined">
                                <InputLabel id="max-players">
                                    Players Number
                                </InputLabel>
                                <Select
                                    css={css({
                                        minWidth: "260px",
                                        background: '#d8d8d'
                                    })}
                                    labelId="max-players"
                                    name="maxPlayers"
                                    label="Players Number"
                                    value={maxPlayers}
                                    onChange={handleSelect}
                                >
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    :
                    null
                }

                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        minHeight: '100px'
                    }}
                >
                    {/* Mode */}
                    <div
                        css={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '10px 0px'
                        }}
                    >
                        <FormControl variant="outlined">
                            <InputLabel id="mode">
                                Mode
                            </InputLabel>
                            <Select
                                css={css({
                                    width: "260px"
                                })}
                                labelId="mode"
                                label="Mode"
                                name="mode"
                                value={mode}
                                onChange={handleSelect}
                            >
                                <MenuItem value="classic">Classic</MenuItem>
                                <MenuItem value="invisible">Invisible Pieces</MenuItem>
                                <MenuItem value="marathon">Marathon</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Gravity Speed */}
                    <div
                        css={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '10px 0px'
                        }}
                    >
                        <FormControl variant="outlined">
                            <InputLabel id="speed">
                                Speed
                            </InputLabel>
                            <Select
                                css={css({
                                    width: "260px",
                                })}
                                label="Speed"
                                labelId="speed"
                                name="speed"
                                value={speed}
                                onChange={handleSelect}
                            >
                                <MenuItem value={2}>Slow</MenuItem>
                                <MenuItem value={1.5}>Classic</MenuItem>
                                <MenuItem value={1}>Fast</MenuItem>
                                <MenuItem value={0.5}>Ultra Fast</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    {isMultiplayer ? 
                        <ButtonGreyBackground
                            disabled={gameParameters.name.length < 4}
                            title="Create" 
                            action={createMultiplayerGame} 
                        />
                        :
                        <ButtonGreyBackground
                            title="Play Solo" 
                            action={createSoloGame} 
                        />
                    }
                </div>
            </div>
        </Modal>
    )
}

export default CreateGameModal