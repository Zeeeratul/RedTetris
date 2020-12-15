

interface positionInterface {
    x: number,
    y: number
}

interface pieceInterface {
    leftTopPosition: positionInterface,
    type: string,
    positions: [positionInterface],
    structure: [[]]
}

export const movePiece = (piece: any, xDirection: number, yDirection: number) => {
    const newPiece = {
        ...piece,
        positions: piece.positions.map((part: positionInterface) => ({x: part.x + xDirection, y: part.y + yDirection})),
        leftTopPosition: {x: piece.leftTopPosition.x + xDirection, y: piece.leftTopPosition.y + yDirection}
    }
    return newPiece
}

const rotatePiece = (piece: any) => {
    const N = piece.length
    const pieceClone = piece.map((arr: any) => arr.slice())

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
//     const lineToDelete = []
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
    return newGrid
}