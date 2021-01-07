/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect, useContext, Fragment } from 'react'
import _ from 'lodash'
import { emitToEvent, subscribeToEvent } from '../../middlewares/socket'
import { SOCKET } from '../../config/constants.json'
import { useHistory } from "react-router-dom"
import { Paper } from '@material-ui/core'
import { Button } from '../Button'


const playersTemp = [
    {
        currentPieceIndex: 0,
        id: "ANuyQw1GhJn0BN-EAAAR",
        score: 0,
        spectrum: [],
        status: "playing",
        position: 3,
        username: "test",
    },
] 

const positionLeaderboardColors: { [index: number] : string } = {
    1: 'gold',
    2: 'silver',
    3: '#cd7f32',
    4: '#d8d8d8',
    5: '#d8d8d8',
}


function EndedGame({ setStatusToIdle }: any) {
    
    const [seconds, setSeconds] = useState(10)

    useEffect(() => {
        const timeoutRef = setInterval(() => {
            setSeconds(seconds => seconds - 1)
        }, 1000)
        return () => clearTimeout(timeoutRef)
    }, [])

    if (seconds < 0)
        setStatusToIdle()

    return (
        <div
            css={{
                gridArea: 'main_grid',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}
        >
            <Paper 
                elevation={3}
                css={css({
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 10px 60px 10px',
                })}   
            >   
                <h1 
                    css={(theme: any) => ({
                        color: theme.colors.text2
                    })}
                >
                    Leaderboard
                </h1>
                <div
                    css={{
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        overflow: 'hidden'
                    }}
                >
                    {_.sortBy(playersTemp, ['position']).map((player: any, index: number) => (
                        <div
                            css={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                backgroundColor: positionLeaderboardColors[index + 1],
                                padding: '0px 10px',
                                borderBottom: '1px solid black',
                            }}
                        >
                            <p>#{index + 1}</p>
                            <p>{player.username}</p>
                            <p>{player.score}</p>
                        </div>
                    ))}
                </div>
                <h2
                    css={{
                        color: 'white'
                    }}
                >Redirection to the lobby in: {seconds}</h2>
            </Paper>
        </div>
    )
}

export default EndedGame
