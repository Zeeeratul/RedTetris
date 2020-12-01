import React, { useState, useEffect, useCallback, useReducer } from 'react'
import useEventListener from '@use-it/event-listener'
import { emitToEvent, subscribeToEvent } from '../../middlewares/socket'
import _ from 'lodash'
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

// change the name

const checkFullLine = (line) => {
    const reducer = (accumulator, currentValue) => accumulator + (currentValue ? 1 : 0)
    if (line.reduce(reducer, 0) === 10)
        return true
    else
        return false
}

// change the name
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
}

const feelLineWithEmpty = () => new Array(10).fill(0)



const initialState = {
    grid: initGrid,
    currentPiece: null,
    nextPiece: null
}

const handleRotate = (currentPiece, grid) => {
    const structureRotated = rotatePiece(currentPiece.structure)
    const updatedPiece = { ...currentPiece, structure: structureRotated }
    const newPiecePositions = convertCoords(updatedPiece)
    if (checkVerticalPosition(newPiecePositions, grid) && checkHorizontalPosition(newPiecePositions, grid))
        return updatedPiece
    else
        return currentPiece   

        // setCurrentPiece(updatedPiece)
}


const handleMoveHorizontal = (x_axis_direction, grid, currentPiece) => {
    const [x, y] = currentPiece.position
    const updatedPiece = { ...currentPiece, position: [x + x_axis_direction, y] }
    const newPiecePositions = convertCoords(updatedPiece)
    if (checkHorizontalPosition(newPiecePositions, grid))
        return updatedPiece
    else
        return currentPiece
}


const handleMoveBottom = (y_axis_direction, grid, currentPiece) => {
    const [x, y] = currentPiece.position
    const updatedPiece = { ...currentPiece, position: [x, y + y_axis_direction] }
    const newPiecePositions = convertCoords(updatedPiece)

    if (checkVerticalPosition(newPiecePositions, grid))
        return updatedPiece
    else {
        return currentPiece
    }
}

const addPieceToTheGrid = (currentPiece, grid) => {
    const newGrid = [...grid]
    const piecePositions = convertCoords(currentPiece)

    piecePositions.forEach((part) => {
        const [x, y] = part
        newGrid[y][x] = currentPiece.type
    })

    return clearFullLine(newGrid)
}

function reducer(state, action) {
    const { grid, currentPiece, nextPiece } = state;

    if (action.type === 'ArrowRight') {
        return {
            ...state,
            currentPiece: handleMoveHorizontal(1, grid, currentPiece)
        }
    } 
    else if (action.type === 'ArrowLeft') {
        return {
            ...state,
            currentPiece: handleMoveHorizontal(-1, grid, currentPiece)
        }
    } 
    else if (action.type === 'ArrowDown') {
        const updatedPiece = handleMoveBottom(1, grid, currentPiece)
        if (updatedPiece.position === currentPiece.position) {
            return {
                grid: addPieceToTheGrid(currentPiece, grid),
                currentPiece: nextPiece,
                nextPiece: null
            }
        }
        else {
            return {
                ...state,
                currentPiece: updatedPiece
            }
        }
    } 
    else if (action.type === 'ArrowUp') {
        const updatedPiece = handleRotate(currentPiece, grid)
        return {
            ...state,
            currentPiece: updatedPiece
        }
    } 
    else if (action.type === 'piece') {
        return {
            ...state,
            currentPiece: action.payload
        }
    }
    else if (action.type === 'next_piece') {
        return {
            ...state,
            nextPiece: action.payload
        }
    }
    // space bar
    else if (action.type === ' ') {
        console.log('space nbars')
        return {
            ...state,
            // nextPiece: action.payload
        }
    }
    else {
        console.log('This key isn\'t supported: ', action.type)
        return state

    //   throw new Error()
    }
  }


function Game() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { grid, currentPiece, nextPiece } = state

    useEffect(() => {
        emitToEvent('piece', '', ({ error, piece }) => {
            dispatch({ type: 'piece', payload: piece })
        })

    }, [])

    useEffect(() => {
        if (!nextPiece) {
            emitToEvent('piece', '', ({ error, piece }) => {
                dispatch({ type: 'next_piece', payload: piece })
            })
        }
    }, [nextPiece])

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch({ type: 'ArrowDown' })
        }, 2000)

        return () => clearInterval(intervalId)
    }, [])

    const piecePositions = currentPiece ? convertCoords(currentPiece) : null

    useEventListener('keydown', ({ key }) => dispatch({
        type: key
    }))

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
