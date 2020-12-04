import _ from 'lodash'
import { piecesArray } from '../config/constants.json'

interface PieceInterface {
    structure: any,
    type: string,
    position: any
}

class Piece {
    structure: any;
    type: string;
    position: any

    constructor() {
        const piece = piecesArray[_.random(6)]
        this.structure = piece.structure
        this.type = piece.type
        this.position = piece.position
    }
}

export { Piece, PieceInterface }