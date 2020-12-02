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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
]


// pieces functions
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


const rotatePiece = (piece) => {
    const N = piece.length
    const pieceClone = piece.map((arr) => arr.slice())

    for (let i = 0; i < N / 2; i++) {
        for (let j = i; j < N - i - 1; j++) {
            let temp = pieceClone[i][j]
            pieceClone[i][j] = pieceClone[N - 1 - j][i]
            pieceClone[N - 1 - j][i] = pieceClone[N - 1 - i][N - 1 - j]
            pieceClone[N - 1 - i][N - 1 - j] = pieceClone[j][N - 1 - i]
            pieceClone[j][N - 1 - i] = temp
        }
    }
    return pieceClone
}

const checkVerticalPosition = (positions, grid) => {
    for (let i = 0; i < positions.length; i++) {
        const [x, y] = positions[i]
        if (y > 21)
            return false
        if (grid[y][x])
            return false
    }
    return true
}

const checkHorizontalPosition = (positions, grid) => {
    for (let i = 0; i < positions.length; i++) {
        const [x, y] = positions[i]
        if (x < 0 || x > 9)
            return false
        if (grid[y][x])
            return false
    }
    return true
}

const movePiece = (piece, xDirection, yDirection) => ({
    ...piece,
    positions: piece.positions.map((part) => [part[0] + xDirection, part[1] + yDirection]),
    position: [piece.position[0] + xDirection, piece.position[1] + yDirection]
})

// grid functions
const fillLineWithEmpty = () => new Array(10).fill(0)

const lineCellsCounter = (line) => {
    const reducer = (accumulator, currentValue) => accumulator + (currentValue ? 1 : 0)
    return line.reduce(reducer, 0)
}

const clearFullLine = (grid) => {
    const lineToDelete = []
    let newGrid = [...grid]

    grid.forEach((line, index) => {
        if (lineCellsCounter(line) === 10)
            lineToDelete.push(index)
    })

    // remove all full line
    _.reverse(lineToDelete).forEach((index) => {
        newGrid.splice(index, 1)
    })

    // add new empty line in the top of grid
    lineToDelete.forEach(() => {
        newGrid.unshift(fillLineWithEmpty())
    })

    return newGrid
}

const addPieceToTheGrid = (piece, grid) => {
    const newGrid = [...grid]

    piece.positions.forEach((part) => {
        const [x, y] = part
        newGrid[y][x] = piece.type
    })

    return clearFullLine(newGrid)
}

const initialState = {
    grid: initGrid,
    currentPiece: null,
    nextPiece: null
}

function reducer(state, action) {
    const { grid, currentPiece, nextPiece } = state

    if (action.type === 'ArrowRight' || action.type === 'ArrowLeft') {
        const xDirection = action.type === 'ArrowRight' ? 1 : -1 
        const updatedPiece = movePiece(currentPiece, xDirection, 0)

        if (checkHorizontalPosition(updatedPiece.positions, grid))
            return {
                ...state,
                currentPiece: updatedPiece
            }
        else
            return state
    }
    else if (action.type === 'ArrowDown') {
        const updatedPiece = movePiece(currentPiece, 0, 1)

        if (checkVerticalPosition(updatedPiece.positions, grid))
            return {
                ...state,
                currentPiece: updatedPiece
            }
        else
            return {
                grid: addPieceToTheGrid(currentPiece, grid),
                currentPiece: nextPiece,
                nextPiece: null
            }
    } 
    else if (action.type === 'ArrowUp') {

        const rotatedStructure = rotatePiece(currentPiece.structure)
        const newPositions = convertCoords({
            position: currentPiece.position,
            structure: rotatedStructure
        })
        
        if (checkVerticalPosition(newPositions, grid) && checkHorizontalPosition(newPositions, grid)) {
            return {
                ...state,
                currentPiece: {
                    ...currentPiece,
                    structure: rotatedStructure,
                    positions: newPositions
                }
            }
        }
        else
            return state
    }
    // space bar
    else if (action.type === ' ') {
        // let countDown = 0

 
        // while (true) {
        //     const piece = handleMoveBottom(countDown, grid, currentPiece)
        //     if (!piece)
        //         break
        //     countDown++
        // }
        // const finalPiece = handleMoveBottom(countDown, grid, currentPiece)
        // console.log(finalPiece)
        // return {
        //     grid: addPieceToTheGrid(finalPiece, grid),
        //     currentPiece: nextPiece,
        //     nextPiece: null
        // }
    }
    else if (action.type === 'piece') {
        const currentPiece = { ...action.payload, positions: convertCoords(action.payload) }
        return {
            ...state,
            currentPiece
        }
    }
    else if (action.type === 'next_piece') {
        const nextPiece = { ...action.payload, positions: convertCoords(action.payload) }
        return {
            ...state,
            nextPiece
        }
    }
    else if (action.type === 'reset') {
        return initialState
    }
    else {
        console.log('This key isn\'t supported: ', action.type)
        return state
    }
}

function Game() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { grid, currentPiece, nextPiece } = state

    useEffect(() => {
        emitToEvent('piece', '', ({ error, piece }) => {
            dispatch({ type: 'piece', payload: piece })
        })

        // const intervalId = setInterval(() => {
        //     dispatch({ type: 'ArrowDown' })
        // }, 1000)

        // return () => {
        //     clearInterval(intervalId)
        //     // dispatch({ type: 'reset' })
        // }
    }, [])

    useEffect(() => {
        if (!nextPiece) {
            emitToEvent('piece', '', ({ error, piece }) => {
                dispatch({ type: 'next_piece', payload: piece })
            })
        }
    }, [nextPiece])

    useEffect(() => {
        if (lineCellsCounter(grid[1]) > 0) {
            console.log('you lose')
            emitToEvent('lose_game')
        }
    }, [grid])

    useEventListener('keydown', ({ key }) => dispatch({ type: key }))




    return (
        <div>
            {nextPiece ? 
                <p>Next piece is {nextPiece.type}</p>
            :
                <p>Next piece</p>
            }


            {currentPiece ?
                <div className="grid" >
                    {grid.map((data, lineNumber) => {
                        return (
                            <Line 
                                key={`line_${lineNumber}`}
                                currentPiece={currentPiece.positions}
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
