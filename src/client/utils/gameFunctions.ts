import _ from 'lodash'

export const movePiece = (piece: Piece, xDirection: number, yDirection: number): Piece => {
    const newPiece = {
        ...piece,
        positions: piece.positions.map((part: Position) => ({x: part.x + xDirection, y: part.y + yDirection})),
        leftTopPosition: {x: piece.leftTopPosition.x + xDirection, y: piece.leftTopPosition.y + yDirection}
    }
    return newPiece
}


export const movePieceToLowerPlace = (piece: Piece, grid: Grid): Piece => {

    let i = 1
    while (true) {
        let updatedPiece = movePiece(piece, 0, i)
        if (!checkPosition(updatedPiece.positions, grid))
            break
        i++
    }

    return movePiece(piece, 0, i - 1)
}

export const rotatePiece = (pieceStructure: StructureType): StructureType => {
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

export const convertStructureToPositions = (pieceStructure: StructureType, leftTopPosition: Position): Position[] => {

    const newPositions: Position[] = []

    pieceStructure.forEach((line: StructureCell[], yCoord: number) => {
        line.forEach((cell: StructureCell, xCoord: number) => {
            if (cell === '#')
                newPositions.push({
                    x: xCoord + leftTopPosition.x,
                    y: yCoord + leftTopPosition.y
                })
        })
    })
    return newPositions
}

export const checkPosition = (positions: Position[], grid: Grid) => {
    for (let i = 0; i < positions.length; i++) {
        const {x, y} = positions[i]
        if ((x < 0 || x > 9) || y > 19)
            return false
        if (grid[y][x])
            return false
    }
    return true
}

export const checkGameOver = (grid: Grid, lineToCheck: number = 2): boolean => {
    const gridWidthLength = grid[0].length

    for (let line = 0; line < lineToCheck; line++) {
        for (let i = 0; i < gridWidthLength; i++) {
            if (grid[line][i] !== '')
                return true
        }
    }

    return false
}

// GRID FUNCTION

export const addPieceToTheGrid = (piece: Piece, grid: Grid) => {
    const newGrid = _.cloneDeep(grid)

    piece.positions.forEach((part: Position) => {
        const {x, y} = part
        newGrid[y][x] = piece.type
    })

    return newGrid
}

const fillLine = (type: PieceType): PieceType[] => new Array(10).fill(type)

const lineCellsCounter = (line: any) => {
    const reducer = (accumulator: number, currentValue: number) => accumulator + (currentValue ? 1 : 0)
    return line.reduce(reducer, 0)
}

export const clearFullLineGrid = (grid: Grid) => {
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
        lineRemoved: lineToDelete.length,
        newGrid
    }
}

export const addPenaltyToGrid = (grid: Grid, lineCount: number) => {
    const newGrid = _.reverse(_.cloneDeep(grid))

    for (let line = 0; line < lineCount; line++) {
        newGrid.unshift(fillLine('*'))
    }

    _.reverse(newGrid)
    newGrid.splice(0, lineCount)

    return newGrid
}

export const getGridSpectrum = (grid: Grid, start = 0, end = 10): number[] => {
    const spectrum = Array(10).fill(20)
    for (let j = start; j < end; j++) {
        for (let i = 0; i < 20; i++) {
            if (grid[i][j] !== '') {
                spectrum[j] = i
                break
            }
        }
    }
    return spectrum
}