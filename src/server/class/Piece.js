const _ = require('lodash')
const { piecesArray } = require('../config/constants')

class Piece {
    constructor() {
        const piece = piecesArray[_.random(6)]
        this.structure = piece.structure
        this.type = piece.type
        this.position = piece.position
    }


}

exports.Piece = Piece