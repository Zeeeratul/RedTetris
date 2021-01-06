/** @jsx jsx */
import { useState, useEffect } from 'react'
import { jsx, css } from '@emotion/react'
import { Modal } from '../Template'
import { MenuItem, Select, FormControl, InputLabel, TextField } from '@material-ui/core';
import { Button } from '../Button'
import { emitToEventWithAcknowledgement } from '../../middlewares/socket';
import { SOCKET } from '../../config/constants.json'
import { useHistory } from "react-router-dom"

const initialState = {
    name: '',
    mode: 'classic',
    speed: 1,
    maxPlayers: 2
}

export function CreateGameModal({ isOpen, isMultiplayer, close}: { isOpen: boolean, isMultiplayer: boolean, close: any }) {

    const history = useHistory()
    const [gameParameters, setGameParameters] = useState(initialState)
    const [error, setError] = useState('')
    const { mode, speed, maxPlayers, name } = gameParameters

    useEffect(() => {
        setError('')
        setGameParameters(initialState)
    }, [isOpen, isMultiplayer])

    const handleChangeName = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = ev.target.value.replace(' ', '')
        setGameParameters({ ...gameParameters, name })
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
                    css={{
                        textAlign: 'center',
                    }}
                >
                    Create your game
                </h2>
                {isMultiplayer ?
                    <div
                        css={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '100px'
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
                        </div>
                        
                        {/* Max Players */}
                        <div
                            css={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <FormControl variant="outlined">
                                <InputLabel id="max-players">
                                    Players Number
                                </InputLabel>
                                <Select
                                    css={css({
                                        minWidth: "260px",
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
                        height: '100px'
                    }}
                >
                    {/* Mode */}
                    <div
                        css={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
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
                            flexDirection: 'column',
                        }}
                    >
                        <FormControl variant="outlined">
                            <InputLabel id="speed">
                                Gravity Speed
                            </InputLabel>
                            <Select
                                css={css({
                                    width: "260px"
                                })}
                                label="Gravity Speed"
                                labelId="speed"
                                name="speed"
                                value={speed}
                                onChange={handleSelect}
                            >
                                <MenuItem value={0.5}>Slow</MenuItem>
                                <MenuItem value={1}>Classic</MenuItem>
                                <MenuItem value={1.5}>Fast</MenuItem>
                                <MenuItem value={3}>Ultra Fast</MenuItem>
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
                    {/* <p
                        css={{
                            color: 'red',
                            // fontSize: '22px'
                        }}
                    >
                        {error}
                    </p> */}
                    {isMultiplayer ? 
                        <Button
                            disabled={gameParameters.name.length < 4}
                            title="Create" 
                            action={createMultiplayerGame} 
                        />
                        :
                        <Button
                            title="Play Solo" 
                            action={createSoloGame} 
                        />
                    }
                </div>
            
            </div>
        </Modal>
    )
}