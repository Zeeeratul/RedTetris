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


export const rotatePiece = (pieceStructure: structureInterface): structureInterface => {
    const N = pieceStructure.length
    const pieceClone = pieceStructure.map((arr: string[]) => arr.slice())

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


// const clearFullLine = (grid: [[]]) => {
//     const lineToDelete : number[] = []
//     let newGrid = [...grid]

//     grid.forEach((line, index) => {
//         if (lineCellsCounter(line) === 10)
//             lineToDelete.push(index)
//     })

//     // remove all full line
//     _.reverse(lineToDelete).forEach((index) => {
//         newGrid.splice(index, 1)
//     })

//     // add new empty line in the top of grid
//     lineToDelete.forEach(() => {
//         newGrid.unshift(fillLineWithEmpty())
//     })

//     return newGrid
// }

export const addPieceToTheGrid = (piece: pieceInterface, grid: any) => {
    const newGrid = [...grid]

    piece.positions.forEach((part: positionInterface) => {
        const {x, y} = part
        newGrid[y][x] = piece.type
    })

    // return clearFullLine(newGrid)
    return (newGrid)
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

