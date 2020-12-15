import React, { useReducer, useState, useEffect } from 'react'
import '../styles/Game.css'
import Grid from '../components/game/Grid'
import { Navbar, Footer, Main, PageContainer, Columm } from '../components/Template'
import { emitToEvent, subscribeToEvent } from '../middlewares/socket'
import { ButtonWithIcon } from '../components/Buttons'
import { movePiece, addPieceToTheGrid } from '../utils/movePiece'
import { checkHorizontalPosition, checkVerticalPosition } from '../utils/checkPiece'
import { SOCKET } from '../config/constants.json'


// const regex = new RegExp('^#[a-zA-Z0-9]*[[a-zA-Z0-9]*]$')


const gridArray = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
]

const initialState = {
    grid: gridArray,
    currentPiece: null,
    nextPiece: null,
    gameStatus: 'idle'
}

function reducer(state: any, action: any) {
    const { grid, currentPiece, nextPiece } = state

    switch (action.type) {
        case 'game_started':
            return {
                grid,
                ...action.payload,
                gameStatus: 'started'
            }
        case 'game_losed':
            return {
                ...initialState,
                gameStatus: 'losed'
            }
        case 'new_piece':
            return {
                ...state,
                currentPiece: nextPiece,
                nextPiece: action.piece
            }
        case 'move_horizontal': 
            const xDirection = action.xDirection
            const updatedPiece = movePiece(currentPiece, xDirection, 0)

            if (checkHorizontalPosition(updatedPiece.positions, grid))
                return {
                    ...state,
                    currentPiece: updatedPiece
                }
            else
                return state
        case 'move_vertical': 
            const updatedPiece2 = movePiece(currentPiece, 0, 1)

            if (checkVerticalPosition(updatedPiece2.positions, grid))
                return {
                    ...state,
                    currentPiece: updatedPiece2
                }
            else
                return {
                    ...state,
                    grid: addPieceToTheGrid(currentPiece, grid),
                    currentPiece: nextPiece,
                    nextPiece: null
                }
        default:
            return state
    }

    // if (action.type === 'ArrowRight' || action.type === 'ArrowLeft') {
    //     const xDirection = action.type === 'ArrowRight' ? 1 : -1 
    //     const updatedPiece = movePiece(currentPiece, xDirection, 0)

    //     if (checkHorizontalPosition(updatedPiece.positions, grid))
    //         return {
    //             ...state,
    //             currentPiece: updatedPiece
    //         }
    //     else
    //         return state
    // }
    // else if (action.type === 'ArrowDown') {
    //     const updatedPiece = movePiece(currentPiece, 0, 1)

    //     if (checkVerticalPosition(updatedPiece.positions, grid))
    //         return {
    //             ...state,
    //             currentPiece: updatedPiece
    //         }
    //     else
    //         return {
    //             grid: addPieceToTheGrid(currentPiece, grid),
    //             currentPiece: nextPiece,
    //             nextPiece: null
    //         }
    // } 
    // else if (action.type === 'ArrowUp') {

    //     const rotatedStructure = rotatePiece(currentPiece.structure)
    //     const newPositions = convertCoords({
    //         position: currentPiece.position,
    //         structure: rotatedStructure
    //     })
        
    //     if (checkVerticalPosition(newPositions, grid) && checkHorizontalPosition(newPositions, grid)) {
    //         return {
    //             ...state,
    //             currentPiece: {
    //                 ...currentPiece,
    //                 structure: rotatedStructure,
    //                 positions: newPositions
    //             }
    //         }
    //     }
    //     else
    //         return state
    // }
    // // space bar
    // else if (action.type === ' ') {
    //     let updatedPiece = movePiece(currentPiece, 0, 1)
    //     updatedPiece = movePiece(updatedPiece, 0, 1)
    //     updatedPiece = movePiece(updatedPiece, 0, 1)

    //     return {
    //         grid: addPieceToTheGrid(updatedPiece, grid),
    //         currentPiece: nextPiece,
    //         nextPiece: null
    //     }

    // }
    // else if (action.type === 'piece') {
    //     const currentPiece = { ...action.payload, positions: convertCoords(action.payload) }
    //     return {
    //         ...state,
    //         currentPiece
    //     }
    // }
    // else if (action.type === 'next_piece') {
    //     const nextPiece = { ...action.payload, positions: convertCoords(action.payload) }
    //     return {
    //         ...state,
    //         nextPiece
    //     }
    // }
    // else if (action.type === 'reset') {
    //     return initialState
    // }
    // else {
    //     console.log('This key isn\'t supported: ', action.type)
    //     return state
    // }
}

function Game() {

    const [state, dispatch] = useReducer(reducer, initialState)
    const { currentPiece, nextPiece, grid, gameStatus } = state

    useEffect(() => {

        subscribeToEvent(SOCKET.GAMES.START, ({ currentPiece, nextPiece, error }: any) => {
            if (error)
                console.error(error)
            else {
                dispatch({ type: 'game_started', payload: {
                    currentPiece,
                    nextPiece
                }})
            }
        })
        
        subscribeToEvent(SOCKET.GAMES.GET_PIECE, ({ piece, error }: any) => {
            if (error)
                console.error(error)
            else {
                dispatch({ type: 'new_piece', piece })
            }
        })

    }, [])

    const startGame = () => {
        emitToEvent(SOCKET.GAMES.START)
    }
  
    return (
        <PageContainer>
            <Navbar />

            <Main>
                {gameStatus === 'started' && currentPiece ? 
                    <Grid
                        piece={currentPiece}
                        dispatch={dispatch}
                        grid={grid}
                    />
                :
                    <p>Wait for game to start</p>
                }

                <Columm>
                    <div>
                        <p>
                            Next Piece: {nextPiece && nextPiece.type}
                        </p>
                        
                    </div>
                    <div>
                        <ButtonWithIcon
                            onClick={startGame}
                        >
                            Start
                        </ButtonWithIcon>
                        <ButtonWithIcon>
                            Leave
                        </ButtonWithIcon>
                    </div>
                </Columm>
            </Main>

            <Footer />
        </PageContainer>
    )
}

export default Game
