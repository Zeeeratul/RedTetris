/** @jsx jsx */
import { jsx } from '@emotion/react'
import useEventListener from '@use-it/event-listener'
import { useInterval } from '../../utils/useInterval'
import { useReducer, useEffect } from 'react'
import { SOCKET } from '../../config/constants.json'
import { 
    cancelSubscribtionToEvent,
    emitToEvent,
    emitToEventWithAcknowledgement,
    subscribeToEvent
} from '../../middlewares/socket'
import { 
    movePiece,
    movePieceToLowerPlace, 
    checkPosition,
    addPieceToTheGrid, 
    rotatePiece,
    convertStructureToPositions,
    checkGameOver,
    clearFullLineGrid,
    addPenaltyToGrid,
    getGridSpectrum
} from '../../utils/gameFunctions'
import { NextPiece } from './NextPiece'
import { Line } from './Line'

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
    isKo: false
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
        case 'KO': {
            return {
                ...state,
                isKO: true
            }
        }
        default:
            console.log(action.type, ' is not supported...')
            return state
    }
}

function Grid({ speed, mode }: { speed: number, mode: string }) {
    const [state, dispatch] = useReducer(reducer, initState)
    const { isKo, piece, nextPiece, grid } = state

    const handleKey = (key: string) => {
        if (!piece || !key || isKo) return

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
                emitToEvent(SOCKET.GAMES.LINE, lineRemoved)
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
            emitToEvent(SOCKET.GAMES.LINE, lineRemoved)
            emitToEventWithAcknowledgement(SOCKET.GAMES.GET_PIECE, {}, (error, nextPiece) => {
                dispatch({ type: 'AddPieceGrid', payload: { newGrid, nextPiece } })
            })
        }
    }

    // Move piece down regularly
    useInterval(
        () => handleKey('ArrowDown'),
        speed * 10000
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

        return () => {
            cancelSubscribtionToEvent(SOCKET.GAMES.LINE_PENALTY)
        }
    }, [])

    // Check game Over
    // Send new grid spectrum
    useEffect(() => {
        if (checkGameOver(grid)) {
            emitToEvent(SOCKET.GAMES.GAME_OVER)
            dispatch({ type: 'KO' })
        }
        
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
                filter: isKo ? 'brightness(0.5)' : 'brightness(1)',
                transition: 'filter 500ms'
            }}
        >
            <div 
                css={(theme: any) => ({
                    width: '300px',
                    height: '600px',
                    display: 'grid',
                    gridTemplateRows: 'repeat(20, minmax(0, 1fr))',
                    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                    border: `15px solid ${theme.colors.text2}`,
                    clipPath: `polygon(15px 0px, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0% calc(100% - 15px), 0% 100%, 0px 15px)`
                })}
            >
                {piece && grid.map((line: any, index: number) => (
                    <Line
                        invisible={mode === 'invisible' ? true : false}
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