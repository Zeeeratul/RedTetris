import _ from 'lodash'

interface positionInterface {
    x: number,
    y: number
}

type structureInterface = string[][]

interface pieceInterface {
    leftTopPosition: positionInterface,
    type: string,
    positions: positionInterface[],
    structure: structureInterface
}

export const movePiece = (piece: pieceInterface, xDirection: number, yDirection: number) => {
    const newPiece = {
        ...piece,
        positions: piece.positions.map((part: positionInterface) => ({x: part.x + xDirection, y: part.y + yDirection})),
        leftTopPosition: {x: piece.leftTopPosition.x + xDirection, y: piece.leftTopPosition.y + yDirection}
    }
    return newPiece
}


export const movePieceToLowerPlace = (piece: pieceInterface, grid: any): pieceInterface => {

    let i = 1
    while (true) {
        let updatedPiece = movePiece(piece, 0, i)
        if (!checkVerticalPosition(updatedPiece.positions, grid))
            break
        i++
    }

    return movePiece(piece, 0, i - 1)
}

export const rotatePiece = (pieceStructure: structureInterface): structureInterface => {
    const N = pieceStructure.length
    const pieceClone = _.cloneDeep(pieceStructure)

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

export const convertStructureToPositions = (pieceStructure: structureInterface, leftTopPosition: positionInterface): any => {

    const newPositions: positionInterface[] = []
    pieceStructure.forEach((line, yCoord) => {
        line.forEach((cell, xCoord) => {
            if (cell === '#')
                newPositions.push({
                    x: xCoord + leftTopPosition.x,
                    y: yCoord + leftTopPosition.y
                })
        })
    })
    return newPositions
}

export const checkVerticalPosition = (positions: positionInterface[], grid: [[]]) => {
    for (let i = 0; i < positions.length; i++) {
        const {x, y} = positions[i]
        if (y > 21)
            return false
        if (grid[y][x])
            return false
    }
    return true
}

export const checkHorizontalPosition = (positions: positionInterface[], grid: [[]]) => {
    for (let i = 0; i < positions.length; i++) {
        const {x, y} = positions[i]
        if (x < 0 || x > 9)
            return false
        if (grid[y][x])
            return false
    }
    return true
}

export const checkGameOver = (grid: any[][]) => {

    for (let i = 0; i < grid[0].length; i++) {
        if (grid[0][i] !== '')
            return true
    }
    for (let i = 0; i < grid[0].length; i++) {
        if (grid[1][i] !== '')
            return true
    }
    return false
}

// GRID FUNCTION

export const addPieceToTheGrid = (piece: pieceInterface, grid: any[][]) => {
    const newGrid = _.cloneDeep(grid)

    piece.positions.forEach((part: positionInterface) => {
        const {x, y} = part
        newGrid[y][x] = piece.type
    })

    return newGrid
}


const fillLine = (char: string): any => new Array(10).fill(char)

const lineCellsCounter = (line: any) => {
    const reducer = (accumulator: number, currentValue: number) => accumulator + (currentValue ? 1 : 0)
    return line.reduce(reducer, 0)
}

export const clearFullLineGrid = (grid: any[][]) => {
    const lineToDelete : number[] = []
    const newGrid = _.cloneDeep(grid)
    
    newGrid.forEach((line, index) => {
        // check that the line is full and if the line isn't a penalty line
        if (lineCellsCounter(line) === 10 && line[0] !== '*')
            lineToDelete.push(index)
    })

    // // remove all full line
    _.reverse(lineToDelete).forEach((index) => {
        newGrid.splice(index, 1)
    })

    // add new empty line in the top of newGrid
    lineToDelete.forEach(() => {
        newGrid.unshift(fillLine(''))
    })

    return {
        count: lineToDelete.length,
        newGrid
    }
}

export const addPenaltyToGrid = (grid: any[][], lineCount: number) => {
    const newGrid = _.cloneDeep(grid)


    
    for (let index = 0; index < lineCount; index++) {
        console.log('add line')
    }
}
