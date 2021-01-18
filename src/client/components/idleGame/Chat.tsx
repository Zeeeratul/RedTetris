/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect, useContext } from 'react'
import { Paper } from '@material-ui/core'
import { UserContext } from '../../utils/userContext';
import SendIcon from '@material-ui/icons/Send';
import { emitToEvent, subscribeToEvent, cancelSubscribtionToEvent } from '../../middlewares/socket'
import { SOCKET } from '../../config/constants.json'

function Chat() {
    const { id: userId } = useContext(UserContext)
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState('')

    useEffect(() => {
        subscribeToEvent(SOCKET.GAMES.MESSAGES, (error, message: Message) => {
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
        <Paper
            elevation={3}
            css={(theme: any) => css({
                backgroundColor: `${theme.colors.dark} !important`,
                width: '300px',
                height: '500px',
                padding: '20px',
                margin: '10px 0px'
            })}   
        >
            <div
                css={(theme: any) => css({
                    backgroundColor: `${theme.colors.darkGrey}`,
                    width: '100%',

                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px'
                })}
            >
                <div
                    id="messages-container"
                    css={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        paddingTop: '7px',
                        overflowY: 'scroll'
                    }}
                >
                    {messages.map((message: any) => (
                        <div
                            key={message.id}
                            css={(theme : any) => ({
                                borderRadius: '10px',
                                padding: '6px 14px',
                                margin: '3px 10px',
                                overflowWrap: 'anywhere',
                                color: theme.colors.text1,
                                backgroundColor: message.sender.id === userId ? theme.colors.text2 : 'black',
                                alignSelf: message.sender.id === userId ? 'flex-end' : 'flex-start'
                            })}
                        >
                            {message.sender.id !== userId &&
                                <span css={{
                                    fontSize: '10px'
                                }}>
                                    {`${message.sender.username}: `}
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
    )
}

export default Chat