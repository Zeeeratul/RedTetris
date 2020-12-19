/** @jsx jsx */
import { jsx } from '@emotion/react'
import useEventListener from '@use-it/event-listener'
import { useReducer, useEffect, useCallback } from 'react'
import { emitToEvent, emitToEventWithAcknowledgement } from '../../middlewares/socket'
import { SOCKET } from '../../config/constants.json'
import { movePiece, checkHorizontalPosition, checkVerticalPosition, addPieceToTheGrid, rotatePiece, convertStructureToPositions } from '../../utils/gameFunctions'
import Line from './Line'


/*
    get piece
    move piece
    MOVe with space bar (hard!!)
    check piece position
    put in grid

    check fullline in grid
    send penalty when clear a full

    send grid spectrum to other
*/

const initState = {
    grid: [
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
        case 'ArrowRight': {
            const updatedPiece = movePiece(piece, 1, 0)
            const correctPosition = checkHorizontalPosition(updatedPiece.positions, grid)
            if (correctPosition)
                return {
                    ...state,
                    piece: updatedPiece
                }
            return state
        }
        case 'ArrowLeft': {
            const updatedPiece = movePiece(piece, -1, 0)
            const correctPosition = checkHorizontalPosition(updatedPiece.positions, grid)
            if (correctPosition)
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
                // dispatch({ type: 'MovePiece', piece: newPiece })
            }
            return state
        }
        case 'ArrowDown': {
            const updatedPiece = movePiece(piece, 0, 1)
            const correctPosition = checkVerticalPosition(updatedPiece.positions, grid)
            if (correctPosition)
                return {
                    ...state,
                    piece: updatedPiece
                }
            else {
                const updatedGrid = addPieceToTheGrid(piece, grid)
                return {
                    ...state,
                    grid: updatedGrid,
                    piece: nextPiece,
                }
            }
        }
        default:
            return state
    }
}

const handleActions = (action: string, grid: any, piece: any, dispatch: any) => {
    switch (action) {

        case 'ArrowRight': {
            const updatedPiece = movePiece(piece, 1, 0)
            const correctPosition = checkHorizontalPosition(updatedPiece.positions, grid)
            if (correctPosition)
                dispatch({ type: 'MovePiece', piece: updatedPiece })
            break
        }
        case 'ArrowLeft': {
            const updatedPiece = movePiece(piece, -1, 0)
            const correctPosition = checkHorizontalPosition(updatedPiece.positions, grid)
            if (correctPosition)
                dispatch({ type: 'MovePiece', piece: updatedPiece })
            break
        }
        case 'ArrowUp': {
            const updatedStructure = rotatePiece(piece.structure)
            const updatedPositions = convertStructureToPositions(updatedStructure, piece.leftTopPosition)
            if (checkVerticalPosition(updatedPositions, grid) && checkHorizontalPosition(updatedPositions, grid)) {
                const newPiece = {
                    ...piece,
                    positions: updatedPositions,
                    structure: updatedStructure
                }
                dispatch({ type: 'MovePiece', piece: newPiece })
            }
            break
        }
        case 'ArrowDown': {
            const updatedPiece = movePiece(piece, 0, 1)
            const correctPosition = checkVerticalPosition(updatedPiece.positions, grid)
            if (correctPosition)
                dispatch({ type: 'MovePiece', piece: updatedPiece })
            else {
                const updatedGrid = addPieceToTheGrid(piece, grid)
                dispatch({ type: 'AddPieceGrid', grid: updatedGrid })
                // emitToEvent(SOCKET.GAMES.GET_PIECE, {}, ({ piece }) => {
                //     dispatch({ type: SOCKET.GAMES.SET_NEXT_PIECE, payload: piece })
                // })
            }
            break
        }
        default:
            console.log(`Unhandled key: ${action}`)
            break
    }
}

function Grid() {

    const [state, dispatch] = useReducer(reducer, initState)
    const { piece, nextPiece, grid } = state
    
    useEffect(() => {
        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, piece) => {
            dispatch({ type: SOCKET.GAMES.SET_PIECE, payload: piece })
        })
        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, piece) => {
            dispatch({ type: SOCKET.GAMES.SET_NEXT_PIECE, payload: piece })
        })
    }, [])

    // const memoizedHandleActions = useCallback(
    //     (action) => {
    //         handleActions(action, grid, piece, dispatch)
    //     },
    //     [grid, piece, dispatch],
    // )
    // 
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         memoizedHandleActions('ArrowDown')
    //     }, 1000)

    //     return () => clearInterval(intervalId)
    // }, [memoizedHandleActions])

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch({ type: 'ArrowDown' })
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

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
