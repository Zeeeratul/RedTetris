/** @jsx jsx */
import { jsx } from '@emotion/react'
import useEventListener from '@use-it/event-listener'
import { useReducer, useEffect } from 'react'
import { emitToEvent, emitToEventWithAcknowledgement, subscribeToEvent } from '../../middlewares/socket'
import { SOCKET } from '../../config/constants.json'
import { 
    movePiece,
    checkHorizontalPosition,
    movePieceToLowerPlace, 
    checkVerticalPosition, 
    addPieceToTheGrid, 
    rotatePiece,
    convertStructureToPositions,
    checkGameOver,
    clearFullLineGrid,
    addPenaltyToGrid
} from '../../utils/gameFunctions'
import Line from './Line'


/*
    send penalty when clear a full

    send grid spectrum to other
*/

const initState = {
    grid: [
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
    
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
    
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
    
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''], 
        ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'], 
    ],
    piece: null,
    nextPiece: null
}

const reducer = (state: any, action: any) => {
    const { piece, nextPiece, grid } = state

    switch (action.type) {

        case SOCKET.GAMES.SET_PIECE:
            return {
                ...state,
                piece: action.payload
            }
        case SOCKET.GAMES.SET_NEXT_PIECE:
            return {
                ...state,
                nextPiece: action.payload
            }
        case SOCKET.GAMES.LINE_PENALTY: {
            addPenaltyToGrid(grid, 2)
            return state
        }
        case 'ArrowRight': {
            const updatedPiece = movePiece(piece, 1, 0)
            if (checkHorizontalPosition(updatedPiece.positions, grid))
                return {
                    ...state,
                    piece: updatedPiece
                }
            return state
        }
        case 'ArrowLeft': {
            const updatedPiece = movePiece(piece, -1, 0)
            if (checkHorizontalPosition(updatedPiece.positions, grid))
                return {
                    ...state,
                    piece: updatedPiece
                }
            return state
        }
        case 'ArrowUp': {
            const updatedStructure = rotatePiece(piece.structure)
            const updatedPositions = convertStructureToPositions(updatedStructure, piece.leftTopPosition)
            if (checkVerticalPosition(updatedPositions, grid) && checkHorizontalPosition(updatedPositions, grid)) {
                const updatedPiece = {
                    ...piece,
                    positions: updatedPositions,
                    structure: updatedStructure
                }
                return {
                    ...state,
                    piece: updatedPiece
                }
            }
            return state
        }
        // Arrow Down
        case 'ArrowDown': {
            const updatedPiece = movePiece(piece, 0, 1)

            if (checkVerticalPosition(updatedPiece.positions, grid))
                return {
                    ...state,
                    piece: updatedPiece
                }
            else {
                const updatedGrid = addPieceToTheGrid(piece, grid)
                const { newGrid, count } = clearFullLineGrid(updatedGrid)

                if (count > 1) {
                    emitToEvent(SOCKET.GAMES.LINE_PENALTY, count - 1)
                    console.log('send to SEND_LINE_PENALTY')
                }

                if (checkGameOver(newGrid)) {
                    emitToEvent(SOCKET.GAMES.END)
                    return state
                }
                else {
                    return {
                        ...state,
                        grid: newGrid,
                        piece: nextPiece,
                        nextPiece: null
                    }
                }
            }
        }

        // Space Bar
        case ' ': {
            const updatedPiece = movePieceToLowerPlace(piece, grid)
            const updatedGrid = addPieceToTheGrid(updatedPiece, grid)
            const { newGrid, count } = clearFullLineGrid(updatedGrid)

            if (count > 1) {
                emitToEvent(SOCKET.GAMES.LINE_PENALTY, count - 1)
                console.log('send to SEND_LINE_PENALTY')
            }

            if (checkGameOver(newGrid)) {
                emitToEvent(SOCKET.GAMES.END)
                return state
            }
            else {
                return {
                    ...state,
                    grid: newGrid,
                    piece: nextPiece, 
                    nextPiece: null
                }
            }

        }
        default:
            console.log(action.type, 'not supported')
            return state
    }
}

function Grid() {

    const [state, dispatch] = useReducer(reducer, initState)
    const { piece, nextPiece, grid } = state
    
    useEffect(() => {
        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, piece) => {
            dispatch({ type: SOCKET.GAMES.SET_PIECE, payload: piece })
        })

        const intervalId = setInterval(() => {
            dispatch({ type: 'ArrowDown' })
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])
    

    // subscribe to others players actions
    useEffect(() => {

        subscribeToEvent(SOCKET.GAMES.LINE_PENALTY, (error, linesCount) => {
            console.log('linesCount', linesCount)
            dispatch({ type: SOCKET.GAMES.LINE_PENALTY, payload: linesCount })
        })

        // subscribeToEvent(SOCKET.GAMES.LINE_PENALTY, (error, linesCount) => {
        //     console.log('linesCount', linesCount)
        // })


    }, [])

    useEffect(() => {
        if (!nextPiece)
            emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, piece) => {
                dispatch({ type: SOCKET.GAMES.SET_NEXT_PIECE, payload: piece })
            })
    }, [nextPiece])

    useEventListener('keydown', ({ key }: { key: string }) => dispatch({ type: key }))

    return (
        <div
            id="grid_container"
            css={{
                gridArea: 'main_grid',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'

            }} 
        >
            <div
                id="next_piece_container"
                css={{
                    width: '100px',
                    height: '100px',
                    border: '1px solid white'
                }}
            >
                Next piece: {nextPiece?.type}
            </div>
            <div 
                css={{
                    width: '300px',
                    height: '600px',
                    display: 'grid',
                    gridTemplateRows: 'repeat(22, minmax(0, 1fr))',
                    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                    columnGap: '3px',
                    rowGap: '3px',
                }}
            >
                {piece && grid.map((line: any, index: number) => (
                    <Line
                        key={`line_${index}`} 
                        piecePositions={piece.positions}
                        pieceType={piece.type}
                        cells={line}
                        yCoord={index}
                    />
                ))}
            </div>

        </div>
    )
}

export default Grid