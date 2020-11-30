import React, { useState, useEffect } from 'react'
import useEventListener from '@use-it/event-listener'
import { initiateSocket, disconnectSocket, subscribeToEvent, emitToEvent } from '../../middlewares/socket'
import _, { map } from 'lodash'
import './game.css'
import Line from './Line'

const initGrid = [
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
    ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
    ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
    ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'], 
    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
]

// pure function
const convertCoords = ({ position, structure }) => {
    const convertedPiece = []
    const [x_position, y_position] = position 

    structure.forEach((line, y) => {
        line.forEach((cell, x) => {
            if (cell !== '*')
                convertedPiece.push([x + x_position, y + y_position])
        })
    })

    return convertedPiece
}

// pure function
const rotatePiece = (piece) => {
    const N = piece.length
    const pieceClone = piece.map((arr) => arr.slice())

    for (let i = 0; i < N / 2; i++) {
        for (let j = i; j < N - i - 1; j++) {
            let temp = pieceClone[i][j];
            pieceClone[i][j] = pieceClone[N - 1 - j][i];
            pieceClone[N - 1 - j][i] = pieceClone[N - 1 - i][N - 1 - j];
            pieceClone[N - 1 - i][N - 1 - j] = pieceClone[j][N - 1 - i];
            pieceClone[j][N - 1 - i] = temp;
        }
    }
    return pieceClone
}

// pure function
const checkVerticalPosition = (futurPosition, grid) => {
    for (let i = 0; i < futurPosition.length; i++) {
        const [x, y] = futurPosition[i]
        if (y > 21)
            return false
        if (grid[y][x])
            return false
    }
    return true
}

// pure function
const checkHorizontalPosition = (futurPosition, grid) => {
    for (let i = 0; i < futurPosition.length; i++) {
        const [x, y] = futurPosition[i]
        if (x < 0 || x > 9)
            return false
        if (grid[y][x])
            return false
    }
    return true
}



function Game() {
    
    const [grid, setGrid] = useState(() => initGrid)
    const [currentPiece, setCurrentPiece] = useState(null)

    useEffect(() => {
        emitToEvent('piece', '', ({ error, piece }) => {
            setCurrentPiece(piece)
        })
    }, [])

    const feelLineWithEmpty = () => new Array(10).fill(0)

    const clearFullLine = (grid) => {
        const lineToDelete = []
        let newGrid = [...grid]

        grid.forEach((line, index) => {
            if (checkFullLine(line))
                lineToDelete.push(index)
        })

        // remove all full line
        _.reverse(lineToDelete).forEach((index) => {
            newGrid.splice(index, 1)
        })

        // add new empty line in the top of grid
        lineToDelete.forEach(() => {
            newGrid.unshift(feelLineWithEmpty())
        })

        return newGrid
        // setGrid(newGrid)
    }

    const piecePositions = currentPiece ? convertCoords(currentPiece) : null

    const handleKeyboard = ({ key }) => {
        switch (key) {
            case 'ArrowRight':
                handleMoveHorizontal(1, grid, currentPiece)
                break;
            case 'ArrowLeft':   
                handleMoveHorizontal(-1, grid, currentPiece)
                break;
            case 'ArrowDown':
                handleMoveBottom(1, grid, currentPiece)
                break;
            case 'ArrowUp':
                handleRotate(currentPiece, grid)
                break;
            default:
                console.log('This key isn\'t supported: ', key)
                break;
        }
    }

    // pure function
    const addPieceToTheGrid = (currentPiece, grid) => {
        const newGrid = [...grid]
        const piecePositions = convertCoords(currentPiece)

        piecePositions.forEach((part) => {
            const [x, y] = part
            newGrid[y][x] = currentPiece.type
        })

        setGrid(clearFullLine(newGrid))
        emitToEvent('piece', '', ({ error, piece }) => {
            setCurrentPiece(piece)
        })
    }

    const handleMoveHorizontal = (x_axis_direction, grid, currentPiece) => {
        const [x, y] = currentPiece.position
        const updatedPiece = { ...currentPiece, position: [x + x_axis_direction, y] }
        const newPiecePositions = convertCoords(updatedPiece)
        if (checkHorizontalPosition(newPiecePositions, grid))
            setCurrentPiece(updatedPiece)
    }

    const handleMoveBottom = (y_axis_direction, grid, currentPiece) => {
        const [x, y] = currentPiece.position
        const updatedPiece = { ...currentPiece, position: [x, y + y_axis_direction] }
        const newPiecePositions = convertCoords(updatedPiece)

        if (checkVerticalPosition(newPiecePositions, grid))
            setCurrentPiece(updatedPiece)
        else
            addPieceToTheGrid(currentPiece, grid)
    }

    const handleRotate = (currentPiece, grid) => {
        const structureRotated = rotatePiece(currentPiece.structure)
        const updatedPiece = { ...currentPiece, structure: structureRotated }
        const newPiecePositions = convertCoords(updatedPiece)
        if (checkVerticalPosition(newPiecePositions, grid) && checkHorizontalPosition(newPiecePositions, grid))
            setCurrentPiece(updatedPiece)
    }

    const checkFullLine = (line) => {
        const reducer = (accumulator, currentValue) => accumulator + (currentValue ? 1 : 0)
        if (line.reduce(reducer, 0) === 10)
            return true
        else
            return false
    }

    useEventListener('keydown', handleKeyboard)

    return (
        <div>
            {currentPiece ?
                <div className="grid" >
                    {grid.map((data, lineNumber) => {
                        return (
                            <Line 
                                key={`line_${lineNumber}`}
                                currentPiece={piecePositions}
                                currentType={currentPiece.type}
                                cells={data}
                                lineNumber={lineNumber}
                                
                            />
                        )
                    }
                    )}
                </div>
                : 
                <p>wait for game to start</p>
            }
            
        </div>
    )
}

export default Game
