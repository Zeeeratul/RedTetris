/** @jsx jsx */
import { useState, useEffect } from 'react'
import { jsx, css } from '@emotion/react'
import { MenuItem, Select, FormControl, InputLabel, TextField } from '@material-ui/core';
import { Button } from '../Button'
import { emitToEventWithAcknowledgement } from '../../middlewares/socket';
import { SOCKET } from '../../config/constants.json'
import { useHistory } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import CloseIcon from '@material-ui/icons/Close'
import styled from '@emotion/styled/macro'

const defaultGameParameters = {
    name: '',
    mode: 'classic',
    speed: 1.5,
    maxPlayers: 2
}

const ButtonGreyBackground = styled(Button)`
    background-color: ${(props: any) => props.theme.colors.lightGrey};
`

const errorMessages: { [index: string] : string } = {
    [SOCKET.GAMES.ERROR.NAME_TAKEN]: "Game name is taken",
    [SOCKET.GAMES.ERROR.INVALID_NAME]: "Game name is invalid",
}

function CreateGameModal({ isOpen, isMultiplayer, close }: { isOpen: boolean, isMultiplayer: boolean, close: any }) {

    const history = useHistory()
    const [gameParameters, setGameParameters] = useState(defaultGameParameters)
    const [error, setError] = useState('')
    const { mode, speed, maxPlayers, name } = gameParameters

    const backdrop = {
        visible: {
            opacity: 1
        },
        hidden: {
            opacity: 0
        }
    }

    const modal = {
        hidden: {
            y: "-100vh",
            opacity: 0,
        },
        visible: {
            y: "150px",
            opacity: 1,
            transition: {
                delay: 0.5
            }
        }
    }

    const closeWithNoClickPropagation = (ev: any) => {
        if (ev.target === ev.currentTarget)
            close()
    }

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
        if (!gameParameters.name) {
            setError(SOCKET.GAMES.ERROR.INVALID_NAME)
            return 
        }

        emitToEventWithAcknowledgement(SOCKET.GAMES.CREATE, gameParameters, (error: SocketError, gameName: string) => {
            if (error) {
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
        emitToEventWithAcknowledgement(SOCKET.GAMES.CREATE, soloGameParameters, (error: SocketError, gameName: string) => {
            if (error) {
                setError(error)
            }
            else {
                close()
                history.push(`/game/${gameName}`)
            }
        })
    }

    return (
        <AnimatePresence exitBeforeEnter>
            {isOpen && (
                <motion.div
                    aria-hidden={!isOpen}
                    onClick={closeWithNoClickPropagation}
                    id="backdrop"
                    css={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                    }}
                    variants={backdrop}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        id="modal"
                        css={(theme: any) => ({
                            margin: "0 auto",
                            padding: "20px 20px",
                            width: '80%',
                            maxWidth: '800px',
                            color: 'white',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            position: 'relative',
                        })}
                        variants={modal}
                    >
                        <button
                            id="close-button"
                            css={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                border: 'none',
                                outline: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: 'transparent',
                                color: 'black',
                                '&:hover': {
                                    background: '#D3D3D3',
                                    transition: '300ms ease-in-out'
                                }
                            }}
                            onClick={close}
                        >
                            <CloseIcon />
                        </button>
                        {/* Modal Content */}
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
                                            data-testid="gamename"
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
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CreateGameModal