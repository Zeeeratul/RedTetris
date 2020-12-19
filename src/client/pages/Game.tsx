import React, { useReducer, useState, useEffect } from 'react'
import _ from 'lodash'
import Grid from '../components/game/Grid'
import GameStarted from '../components/game/GameStarted'
import { Navbar, Footer, Main, PageContainer, Columm } from '../components/Template'
import { emitToEvent, emitToEventWithAcknowledgement, subscribeToEvent } from '../middlewares/socket'
import { ButtonWithIcon } from '../components/Buttons'
import { useHistory } from "react-router-dom"
import { SOCKET } from '../config/constants.json'


const regex = new RegExp('^#[a-zA-Z0-9]*$')

interface GameInfo {
    name: string;
    status: string;
    players: any[];
    maxPlayers: number;
    mode: string;
    speed: number;
    isLeader: boolean;
}

const initialState = {
    name: '',
    players: [],
    maxPlayers: 2,
    mode: 'classic',
    speed: 1,
    isLeader: false,
    // status: 'idle'
    status: 'started'
}

const reducer = (gameInfo: GameInfo, action: any) => {

    switch (action.type) {
        case SOCKET.GAMES.INFO: 
            return {
                ...gameInfo,
                ...action.payload
            }
        case SOCKET.GAMES.START:
            return {
                ...gameInfo,
                status: 'started'
            }
        case SOCKET.GAMES.END:
            return {
                ...gameInfo,
                status: 'end'
            }
        default:
            return gameInfo
    }
}


function Game() {

    const history = useHistory()
    const [state, dispatch] = useReducer(reducer, initialState)
    const { status, isLeader, players } = state

    useEffect(() => {
        // get game when landing on this page
        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_INFO, {}, (error, data) => {
            if (data)
                dispatch({ type: SOCKET.GAMES.INFO, payload: data })
        })

        // when player join or leave, ask the server for the new game info
        subscribeToEvent(SOCKET.GAMES.INFO, (error, { type, content }) => {
            
            if (type === SOCKET.GAMES.JOIN || type === SOCKET.GAMES.LEAVE) {
                emitToEventWithAcknowledgement(SOCKET.GAMES.GET_INFO, {}, (error, data) => {
                    if (data)
                        dispatch({ type: SOCKET.GAMES.INFO, payload: data })
                })
            }
        })

        subscribeToEvent(SOCKET.GAMES.START, () => {
            dispatch({ type: SOCKET.GAMES.START })
        })

        return () => emitToEvent(SOCKET.GAMES.LEAVE)
    }, [])

    const startGame = () => {
        emitToEvent(SOCKET.GAMES.START)
    }

    const leaveGame = () => {
        history.push('/games')
    }

    if (status === 'idle') {
        return (
            <PageContainer>
                <Navbar />

                <Main>
                    <div>
                        {players.map((player: any) => {
                            return <p key={`player_${player.username}`}>{player.username}</p>
                        })}
                    </div>
                    {isLeader &&
                        <ButtonWithIcon
                            onClick={startGame}
                        >
                            Start
                        </ButtonWithIcon>
                    }
                    <ButtonWithIcon
                        onClick={leaveGame}
                    >
                        Leave
                    </ButtonWithIcon>
                </Main>

                <Footer />
            </PageContainer>
        )
    }
    else if (status === 'started') {
        return (
            <GameStarted
                otherPlayers={_.filter(players, { 'yourself': false })}
            >
                {/* 4 little grid 
                + one grid */}

            </GameStarted>
        )
    }

    return (
        <div>test</div>
    )
  
    // return (
        // <PageContainer>
        //     <Navbar />

        //     <Main>
        //         {/* {gameStatus === 'started' && currentPiece ? 
        //             <Grid
        //                 piece={currentPiece}
        //                 dispatch={dispatch}
        //                 grid={grid}
        //             />
        //         :
        //             <p>Wait for game to start</p>
        //         } */}

        //         <Columm>
        //             <div>
        //                 <p>
        //                     Next Piece: {nextPiece && nextPiece.type}
        //                 </p>
                        
        //             </div>
        //             <div>
        //                 <ButtonWithIcon
        //                     onClick={startGame}
        //                 >
        //                     Start
        //                 </ButtonWithIcon>
        //                 <ButtonWithIcon>
        //                     Leave
        //                 </ButtonWithIcon>
        //             </div>
        //         </Columm>
        //     </Main>

        //     <Footer />
        // </PageContainer>
    // )
}

export default Game
