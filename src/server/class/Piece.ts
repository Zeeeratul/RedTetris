import _ from 'lodash'
import { piecesArray } from '../constants.json'
import { Coords } from './types'

class Piece {
    structure: string[][];
    type: string;
    leftTopPosition: Coords;
    positions: Coords[];

    constructor() {
        const piece = piecesArray[_.random(6)]
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