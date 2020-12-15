import { Piece } from '../../server/class/Piece'


test('Piece Class, object good format', () => {
    const piece = new Piece()

    expect(typeof piece.type).toBe('string')
})