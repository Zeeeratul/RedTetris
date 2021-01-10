/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useEffect } from 'react'
import _ from 'lodash'
import { Paper } from '@material-ui/core'

const positionLeaderboardColors: { [index: number] : string } = {
    1: 'gold',
    2: 'silver',
    3: '#cd7f32',
    4: '#d8d8d8',
    5: '#d8d8d8',
}

function EndedGame({ setStatusToIdle, results }: any) {
    
    // Redirect to lobby after 10 seconds
    useEffect(() => {
        const timeoutRef = setTimeout(() => {
            setStatusToIdle()
        }, 10000)
        return () => clearTimeout(timeoutRef)
    }, [setStatusToIdle])

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
                css={(theme: any) => css({
                    width: '100%',
                    display: 'flex',
                    backgroundColor: `${theme.colors.dark} !important`,
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
                    {_.sortBy(results, ['position']).map((result: any, index: number) => (
                        <div
                            key={result.id}
                            css={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                backgroundColor: positionLeaderboardColors[index + 1],
                                padding: '0px 10px',
                                borderBottom: '1px solid black',
                            }}
                        >
                            <p>#{index + 1}</p>
                            <p>{result.username}</p>
                            <p>{result.score}</p>
                        </div>
                    ))}
                </div>
            </Paper>
        </div>
    )
}

export default EndedGame
