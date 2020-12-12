import _ from 'lodash'
import { piecesArray } from '../config/constants.json'

interface PieceInterface {
    structure: any,
    type: string,
    leftTopPosition: any,
    positions: any,

}

class Piece {
    structure: any;
    type: string;
    leftTopPosition: any;
    positions: any;

    constructor() {
        const piece = piecesArray[_.random(6)]
        this.structure = piece.structure
        this.type = piece.type
        this.leftTopPosition = piece.leftTopPosition
        this.positions = piece.positions
    }
}

export { Piece, PieceInterface }