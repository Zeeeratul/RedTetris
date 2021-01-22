import { Piece } from '../../../server/class/Piece'
import { addPenaltyToGrid, addPieceToTheGrid, checkGameOver, checkPosition, clearFullLineGrid, getGridSpectrum, movePiece, movePieceToLowerPlace, rotatePiece } from '../../../client/utils/gameFunctions'

let grid
let piece: Piece

beforeEach(() => {
    piece = new Piece()
    grid = Array(20).fill(Array(10).fill(''))
})

afterEach(() => {
    piece = null
    grid = null
})

test('movePiece', () => {
    const { leftTopPosition: { x: xLeftTopPosition } } = piece
    const updatedPiece = movePiece(piece, 1, 0)
    expect(xLeftTopPosition + 1).toEqual(updatedPiece.leftTopPosition.x)
})

test('movePieceToLowerPlace', () => {
    const updatedPiece = movePieceToLowerPlace(piece, grid)
    const pieceIsAtTheLower = updatedPiece.positions.map((position) => position.y === 19)
    expect(pieceIsAtTheLower.includes(true)).toBeTruthy()
})

test('rotatePiece', () => {
    // 4 rotation === go back to the initial structure

    const rotatedStructure1time = rotatePiece(piece.structure)
    const rotatedStructure2time = rotatePiece(rotatedStructure1time)
    const rotatedStructure3time = rotatePiece(rotatedStructure2time)
    const rotatedStructure4time = rotatePiece(rotatedStructure3time)

    expect(piece.structure).toMatchObject(rotatedStructure4time)
})

test('convertStructureToPositions', () => {
    // 4 rotation === go back to the initial structure

    const rotatedStructure1time = rotatePiece(piece.structure)
    const rotatedStructure2time = rotatePiece(rotatedStructure1time)
    const rotatedStructure3time = rotatePiece(rotatedStructure2time)
    const rotatedStructure4time = rotatePiece(rotatedStructure3time)

    expect(piece.structure).toMatchObject(rotatedStructure4time)
})

test('checkPositions', () => {
    const incorrectPositions = [
        {
            x: -2,
            y: 20,
        },
        {
            x: 1,
            y: 1,
        },
        {
            x: 1,
            y: 2,
        },
        {
            x: 1,
            y: 3,
        }
    ]
    expect(checkPosition(incorrectPositions, grid)).toBeFalsy()
})

test('checkGameOver', () => {
    const filledGrid = Array(20).fill(Array(10).fill('*'))
    expect(checkGameOver(filledGrid)).toBeTruthy()
})

test('clearFullLineGrid', () => {
    const filledGrid = Array(20).fill(Array(10).fill('I'))
    const {newGrid} = clearFullLineGrid(filledGrid)
    expect(newGrid).toMatchObject(grid)
})

test('addPieceToTheGrid', () => {
    const { x, y } = piece.positions[0]
    const updatedGrid = addPieceToTheGrid(piece, grid)
    expect(updatedGrid[y][x]).toEqual(piece.type)
})

test('addPenaltyToGrid', () => {
    const newGrid = addPenaltyToGrid(grid, 2)
    const twoLinesFilledGrid = Array(20).fill(Array(10).fill(''))
    twoLinesFilledGrid[18] = Array(10).fill('*')
    twoLinesFilledGrid[19] = Array(10).fill('*')
    expect(newGrid).toMatchObject(twoLinesFilledGrid)
})

test('getGridSpectrum', () => {
    const spectrum = getGridSpectrum(grid)
    expect(spectrum).toStrictEqual(Array(10).fill(20))
})