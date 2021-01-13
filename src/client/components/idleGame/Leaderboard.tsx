/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { Paper } from '@material-ui/core'
import _ from 'lodash'

const positionLeaderboardColors: { [index: number] : string } = {
    1: 'gold',
    2: 'silver',
    3: '#cd7f32',
    4: '#d8d8d8',
    5: '#d8d8d8',
}

function Leaderboard({ results }: { results: ResultInterface[] }) {

    return (
        <Paper
            elevation={3}
            css={(theme: any) => css({
                backgroundColor: `${theme.colors.dark} !important`,
                minWidth: '300px',
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
                <h1 
                    css={(theme: any) => ({
                        color: theme.colors.text2
                    })}
                >
                    Leaderboard
                </h1>
                <div
                    css={{
                        width: '90%',
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
            </div>
        </Paper>
    )
}

export default Leaderboard
