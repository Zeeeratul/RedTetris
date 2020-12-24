/** @jsx jsx */
import { jsx } from '@emotion/react'
import useEventListener from '@use-it/event-listener'
import { useReducer, useEffect } from 'react'
import { emitToEvent, emitToEventWithAcknowledgement, subscribeToEvent, cancelSubscribtionToEvent } from '../../middlewares/socket'
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
    addPenaltyToGrid,
} from '../../utils/gameFunctions'
import Line from './Line'


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
        ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', ''],
        ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', ''],
        ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', ''],
    ],
    piece: null,
    nextPiece: null,
}

const reducer = (state: any, action: any) => {
    const { piece, nextPiece, grid } = state

    switch (action.type) {

        case SOCKET.GAMES.SET_PIECE: {
            return {
                ...state,
                piece: action.payload
            }
        }
        case SOCKET.GAMES.SET_NEXT_PIECE: {
            return {
                ...state,
                nextPiece: action.payload
            }
        }
        case SOCKET.GAMES.LINE_PENALTY: {
            const newGrid = addPenaltyToGrid(grid, action.payload)
            return {
                ...state,
                grid: newGrid
            }
        }
        case 'MovePiece': {
            return {
                ...state,
                piece: action.payload
            }
        }
        case 'AddPieceGrid': {
            return {
                ...state,
                grid: action.payload,
                piece: nextPiece,
                nextPiece: null
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

    const handleKey = (key: string) => {
        if (key === "ArrowRight") {
            const updatedPiece = movePiece(piece, 1, 0)
            if (checkHorizontalPosition(updatedPiece.positions, grid))
                dispatch({ type: 'MovePiece', payload: updatedPiece })
        }
        else if (key === "ArrowLeft") {
            const updatedPiece = movePiece(piece, -1, 0)
            if (checkHorizontalPosition(updatedPiece.positions, grid))
                dispatch({ type: 'MovePiece', payload: updatedPiece })
        }
        // key up rotate piece if possible
        else if (key === "ArrowUp") {
            const updatedStructure = rotatePiece(piece.structure)
            const updatedPositions = convertStructureToPositions(updatedStructure, piece.leftTopPosition)
            if (checkVerticalPosition(updatedPositions, grid) && checkHorizontalPosition(updatedPositions, grid)) {
                const updatedPiece = {
                    ...piece,
                    positions: updatedPositions,
                    structure: updatedStructure
                }
                dispatch({ type: 'MovePiece', payload: updatedPiece })
            }
        }
        else if (key === "ArrowDown") {
            const updatedPiece = movePiece(piece, 0, 1)
            if (checkHorizontalPosition(updatedPiece.positions, grid) && checkVerticalPosition(updatedPiece.positions, grid))
                dispatch({ type: 'MovePiece', payload: updatedPiece })
            else {
                const updatedGrid = addPieceToTheGrid(piece, grid)
                const { newGrid, lineRemoved } = clearFullLineGrid(updatedGrid)
                if (lineRemoved > 1)
                    emitToEvent(SOCKET.GAMES.LINE_PENALTY, lineRemoved)
                if (checkGameOver(newGrid))
                    emitToEvent(SOCKET.GAMES.GAME_OVER)
                else
                    dispatch({ type: 'AddPieceGrid', payload: newGrid })
            }
        }
        // space bar move to the lower point of the grid
        else if (key === " ") {
            const updatedPiece = movePieceToLowerPlace(piece, grid)
            const updatedGrid = addPieceToTheGrid(updatedPiece, grid)
            const { newGrid, lineRemoved } = clearFullLineGrid(updatedGrid)
            if (lineRemoved > 1)
                emitToEvent(SOCKET.GAMES.LINE_PENALTY, lineRemoved)
            if (checkGameOver(newGrid))
                emitToEvent(SOCKET.GAMES.GAME_OVER)
            else
                dispatch({ type: 'AddPieceGrid', payload: newGrid })
        }
    }

    useEffect(() => {
        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, piece) => {
            dispatch({ type: SOCKET.GAMES.SET_PIECE, payload: piece })
        })

        // const intervalId = setInterval(() => {
        //     dispatch({ type: 'ArrowDown' })
        // }, 10000)

        // return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        if (!nextPiece)
            emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, piece) => {
                dispatch({ type: SOCKET.GAMES.SET_NEXT_PIECE, payload: piece })
            })
    }, [nextPiece])
    
    // subscribe to others players actions
    useEffect(() => {
        subscribeToEvent(SOCKET.GAMES.LINE_PENALTY, (error, linesCount) => {
            dispatch({ type: SOCKET.GAMES.LINE_PENALTY, payload: linesCount })
        })
    }, [])

    useEventListener('keydown', ({ key }: { key: string }) => handleKey(key))

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
                    gridTemplateRows: 'repeat(20, minmax(0, 1fr))',
                    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                    columnGap: '3px',
                    rowGap: '3px',
                }}
            >
                {piece && grid.map((line: any, index: number) => {
                    if (index === 0 || index === 1) 
                        return null
                    else
                        return <Line
                            key={`line_${index}`} 
                            piecePositions={piece.positions}
                            pieceType={piece.type}
                            cells={line}
                            yCoord={index}
                        />
                })}
            </div>

        </div>
    )
}

export default Grid