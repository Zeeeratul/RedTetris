import _ from 'lodash'
import { piecesArray } from '../constants.json'

class Piece {
    structure: StructureType;
    type: PieceType;
    leftTopPosition: Position;
    positions: Position[];

    constructor() {
        const piece = piecesArray[_.random(6)] as Piece
        this.structure = piece.structure
        this.type = piece.type
        this.leftTopPosition = piece.leftTopPosition
        this.positions = piece.positions
    }

    static generatingPiecesPool() {
        const pieces : Piece[] = []
        for (let i = 0; i < 50; i++) {
            const piece = new Piece()
            pieces.push(piece)
        }
        return pieces
    }
}

export { Piece }