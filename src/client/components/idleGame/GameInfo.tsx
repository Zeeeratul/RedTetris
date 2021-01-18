/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled/macro'
import { Paper } from '@material-ui/core'
import { Button } from '../Button'

const speedToText: { [index: number] : string } = {
    2: 'Slow',
    1.5: 'Classic',
    1: 'Fast',
    0.5: 'Ultra Fast',
}

const modeToText: { [index: string] : string } = {
    "classic": 'Classic',
    "invisible": 'Invisible',
    "marathon": 'Marathon',
}

const PTag = styled.p((props: any) => ({
    color: props.theme.colors.text2,
    fontSize: '18px',
    margin: '4px 0px'
}))

function GameInfo({ 
    gameName,
    players,
    maxPlayers,
    speed,
    mode, 
    isLeader, 
    startGame 
}: { 
    gameName: string, 
    players: Player[], 
    maxPlayers: GameMaxPlayers, 
    speed: GameSpeed, 
    mode: GameMode, 
    isLeader: boolean, 
    startGame: any }) {

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
                    justifyContent: 'space-around',
                    borderRadius: '10px'
                })}
            >
                <div 
                    id="game_info"
                    css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <h2
                        css={(theme: any) => ({
                            color: theme.colors.text2,
                            margin: '6px 0px'
                        })}
                    >
                        {gameName}
                    </h2>
                    <PTag>Mode: <span css={(theme: any) => ({ color: theme.colors.text1 })}>{modeToText[mode]}</span></PTag>
                    <PTag>Speed: <span css={(theme: any) => ({ color: theme.colors.text1 })}>{speedToText[speed]}</span></PTag>
                </div>

                <div
                    id="players-lists"
                    css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <h2
                        css={(theme:any) => ({
                            color: theme.colors.text2,
                            margin: '4px 0px'
                        })}
                    >
                        Players ({players.length} / {maxPlayers})
                    </h2>
                    {players.map((player) => (
                        <PTag
                            css={(theme: any) => ({
                                color: theme.colors.text1
                            })}
                            key={`player_name${player.id}`}
                        >
                            {player.username}
                        </PTag>
                    ))}

                </div>

                <div
                    css={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '20px'
                    }}
                >
                    {isLeader &&
                        <Button title="Start" action={startGame} />
                    }
                </div>
            </div>
        </Paper>
    )
}

export default GameInfo
