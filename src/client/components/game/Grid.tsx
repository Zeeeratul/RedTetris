/** @jsx jsx */
import { jsx } from '@emotion/react'
import useEventListener from '@use-it/event-listener'
import { useInterval } from '../../utils/useInterval'
import { useReducer, useEffect } from 'react'
import { SOCKET } from '../../config/constants.json'
import { emitToEvent, emitToEventWithAcknowledgement, subscribeToEvent } from '../../middlewares/socket'
import { 
    movePiece,
    checkPosition,
    movePieceToLowerPlace, 
    addPieceToTheGrid, 
    rotatePiece,
    convertStructureToPositions,
    checkGameOver,
    clearFullLineGrid,
    addPenaltyToGrid,
    getGridSpectrum
} from '../../utils/gameFunctions'
import { NextPiece } from './NextPiece'
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
        ['', '', '', '', '', '', '', '', '', ''],
    ],
    piece: null,
    nextPiece: null,
}

const reducer = (state: any, action: any) => {
    const { nextPiece, grid } = state

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
                grid: action.payload.newGrid,
                piece: nextPiece,
                nextPiece: action.payload.nextPiece
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
        if (!piece || !key) return

        if (key === "ArrowRight") {
            const updatedPiece = movePiece(piece, 1, 0)
            if (checkPosition(updatedPiece.positions, grid))
                dispatch({ type: 'MovePiece', payload: updatedPiece })
        }
        else if (key === "ArrowLeft") {
            const updatedPiece = movePiece(piece, -1, 0)
            if (checkPosition(updatedPiece.positions, grid))
                dispatch({ type: 'MovePiece', payload: updatedPiece })
        }
        // Rotation
        else if (key === "ArrowUp") {
            const updatedStructure = rotatePiece(piece.structure)
            const updatedPositions = convertStructureToPositions(updatedStructure, piece.leftTopPosition)
            if (checkPosition(updatedPositions, grid)) {
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
            if (checkPosition(updatedPiece.positions, grid))
                dispatch({ type: 'MovePiece', payload: updatedPiece })
            else {
                const updatedGrid = addPieceToTheGrid(piece, grid)
                const { newGrid, lineRemoved } = clearFullLineGrid(updatedGrid)
                if (lineRemoved > 1)
                    emitToEvent(SOCKET.GAMES.LINE_PENALTY, lineRemoved)
                emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, nextPiece) => {
                    dispatch({ type: 'AddPieceGrid', payload: { newGrid, nextPiece } })
                })
            }
        }
        // Space bar
        else if (key === " ") {
            const updatedPiece = movePieceToLowerPlace(piece, grid)
            const updatedGrid = addPieceToTheGrid(updatedPiece, grid)
            const { newGrid, lineRemoved } = clearFullLineGrid(updatedGrid)
            if (lineRemoved > 1)
                emitToEvent(SOCKET.GAMES.LINE_PENALTY, lineRemoved)
            emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, nextPiece) => {
                dispatch({ type: 'AddPieceGrid', payload: { newGrid, nextPiece } })
            })
        }
    }

    // Every second move piece down
    useInterval(
        () => handleKey('ArrowDown'),
        1000
    )

    // Get pieces at start
    useEffect(() => {
        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, piece) => {
            dispatch({ type: SOCKET.GAMES.SET_PIECE, payload: piece })
        })

        emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, piece) => {
            dispatch({ type: SOCKET.GAMES.SET_NEXT_PIECE, payload: piece })
        })

        // Subscribe to line penalty sended by the players
        subscribeToEvent(SOCKET.GAMES.LINE_PENALTY, (error, linesCount) => {
            dispatch({ type: SOCKET.GAMES.LINE_PENALTY, payload: linesCount })
        })
    }, [])

    // Check game Over
    // Send new grid spectrum
    useEffect(() => {
        if (checkGameOver(grid))
            emitToEvent(SOCKET.GAMES.GAME_OVER)
        
        const spectrum = getGridSpectrum(grid)
        emitToEvent(SOCKET.GAMES.SPECTRUM, spectrum)
    }, [grid])
    
    useEventListener('keydown', ({ key }: { key: string }) => handleKey(key))

    return (
        <div
            id="grid_container"
            css={{
                gridArea: 'main_grid',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }} 
        >
            <div 
                css={{
                    width: '300px',
                    height: '600px',
                    display: 'grid',
                    gridTemplateRows: 'repeat(20, minmax(0, 1fr))',
                    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                    border: '10px solid cyan',
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
            <NextPiece pieceType={nextPiece?.type} />
        </div>
    )
}

export default Grid