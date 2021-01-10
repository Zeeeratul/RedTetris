/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled/macro'
import { useState, useEffect, useContext, Fragment } from 'react'
import { emitToEvent, subscribeToEvent, cancelSubscribtionToEvent } from '../../middlewares/socket'
import { SOCKET } from '../../config/constants.json'
import { Paper } from '@material-ui/core'
import { UserContext } from '../../utils/userContext'
import SendIcon from '@material-ui/icons/Send'

interface MessageInterface {
    sender: string,
    content: string,
    id: string
}

const P = styled.p((props: any) => ({
    color: props.theme.colors.text1,
    fontSize: '20px'
}))

const speedToText: { [index: number] : string } = {
    2: 'Slow',
    1.5: 'Classic',
    1: 'Fast',
    0.5: 'Ultra Fast',
}

function IdleGame({ players, isSoloGame, speed = 1.5, mode }: { players: any[], isSoloGame: boolean, speed: number, mode: string }) {

    const { username: userUsername } = useContext(UserContext)
    const [messages, setMessages] = useState<MessageInterface[]>([])
    const [message, setMessage] = useState('')

    useEffect(() => {
        subscribeToEvent(SOCKET.GAMES.MESSAGES, (error, message: MessageInterface) => {
            if (!error) {
                setMessages((messages) => [...messages, message])
            }
            else 
                console.error(error)
        })

        return () => {
            cancelSubscribtionToEvent(SOCKET.GAMES.MESSAGES)
        }
    }, [])

    const handleSubmit = (ev: React.SyntheticEvent) => {
        ev.preventDefault()
        if (message) {
            emitToEvent(SOCKET.GAMES.MESSAGES, message)
            setMessage('')
        }
    }

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(ev.target.value)
    }

    return (
        <Fragment>
            {/* Game info */}
            <div
                css={{
                    gridArea: 'little_grid_1 / little_grid_1 / little_grid_3 / little_grid_1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    css={(theme: any) => css({
                        width: '90%',
                        minHeight: '60%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${theme.colors.dark} !important`,
                    })}   
                >
                    <div>
                        <h1
                            css={(theme: any) => ({
                                color: theme.colors.text2,
                            })}
                        >
                            Players:
                        </h1>
                        {players.map((player: any) => (
                            <P
                                key={player.id}
                            >
                                {player.username}
                            </P>
                        ))}
                        <h1
                            css={(theme: any) => ({
                                color: theme.colors.text2,
                            })}
                        >
                            Mode:
                        </h1>
                        <P>{mode.charAt(0).toUpperCase() + mode.slice(1)}</P>
                        <h1
                            css={(theme: any) => ({
                                color: theme.colors.text2,
                            })}
                        >
                            Speed:
                        </h1>
                        <P>{speedToText[speed]}</P>
                    </div>
                </Paper>
            </div>

            {/* Chat */}
            {isSoloGame ? null :
            <div
                css={{
                    gridArea: 'main_grid / main_grid / main_grid / little_grid_2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    css={(theme: any) => css({
                        width: '25%',
                        minWidth: '300px',
                        height: '90%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        backgroundColor: `${theme.colors.dark} !important`,
                    })}   
                >
                    <div
                        id="chat-container"
                        css={(theme: any) => ({
                            width: '100%',
                            height: '100%',
                            backgroundColor: theme.colors.darkGrey,
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        })}
                    >
                        {/* fix the full height max height blabla */}
                        <div
                            css={{
                                width: '100%',
                                flexGrow: 1,
                                maxHeight: '500px',
                                overflowY: 'scroll',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                paddingTop: '6px',
                            }}
                        >
                        {messages.map((message: any) => (
                            <div
                                key={message.id}
                                css={(theme : any) => ({
                                    borderRadius: '10px',
                                    padding: '6px 14px',
                                    margin: '3px 10px',
                                    color: theme.colors.text1,
                                    backgroundColor: message.sender === userUsername ? 'red' : 'black',
                                    alignSelf: message.sender === userUsername ? 'flex-end' : 'flex-start'
                                })}
                            >
                                {message.sender === userUsername 
                                    ? null 
                                    :
                                    <span css={{
                                        fontSize: '10px'
                                    }}>
                                        {`${message.sender}: `}
                                    </span>
                                }
                                {message.content}
                            </div>
                        ))}
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            css={{
                                width: '100%',
                                minHeight: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <input 
                                css={(theme : any) => ({
                                    borderRadius: '10px 0px 0px 10px',
                                    padding: '6px 14px',
                                    height: '28px',
                                    border: 'none',
                                    width: '70%',
                                    outline: 'none',
                                    fontSize: '16px',
                                    color: theme.colors.text2,
                                    fontFamily: 'Audiowide, cursive',
                                    '&::placeholder': {
                                        color: 'red'
                                    }
                                })}
                                placeholder="Message..."
                                onChange={handleChange}
                                value={message}
                                name="message"
                            />
                            <button
                                type="submit"
                                css={(theme: any) => ({
                                    border: 'none',
                                    height: '40px',
                                    borderRadius: '0px 10px 10px 0px',
                                    cursor: 'pointer',
                                    backgroundColor: theme.colors.lightGrey,
                                    color: theme.colors.text2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                })}
                            >
                                <SendIcon />
                            </button>

                        </form>
                    </div>
                </Paper>
            </div>
            }
        </Fragment>
    )
}

export default IdleGame
