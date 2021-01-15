import { Piece } from '../../server/class/Piece'


test('constructor', () => {
    const piece = new Piece()

    expect(typeof piece.type).toBe('string')
})

test('generatingPiecesPool function', () => {
    const piecesHeap = Piece.generatingPiecesPool()

    expect(piecesHeap.length).toBe(50)
})