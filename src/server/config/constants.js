// array of all the pieces
const piecesArray = [
    {
        structure: [
            ['*', '*', '*', '*'],
            ['I', 'I', 'I', 'I'],
            ['*', '*', '*', '*'],
            ['*', '*', '*', '*'],
        ],
        type: 'I',
        position: [3, 0]
    },
    {
        structure: [
            ['O', 'O'],
            ['O', 'O'],
        ],
        type: 'O',
        position: [4, 0]
    },
    {
        structure: [
            ['J', '*', '*'],
            ['J', 'J', 'J'],
            ['*', '*', '*'],
        ],
        type: 'J',
        position: [3, 0]
    },
    {
        structure: [
            ['*', '*', 'L'],
            ['L', 'L', 'L'],
            ['*', '*', '*'],
        ],
        type: 'L',
        position: [3, 0]
    },
    {
        structure: [
            ['*', 'S', 'S'],
            ['S', 'S', '*'],
            ['*', '*', '*'],
        ],
        type: 'S',
        position: [3, 0]
    },
    {
        structure: [
            ['Z', 'Z', '*'],
            ['*', 'Z', 'Z'],
            ['*', '*', '*'],
        ],
        type: 'Z',
        position: [3, 0]
    },
    {
        structure: [
            ['*', 'T', '*'],
            ['T', 'T', 'T'],
            ['*', '*', '*'],
        ],
        type: 'T',
        position: [3, 0]
    },
]


// all actions

// const ACTIONS = {
//     LOGIN,
//     DISCONNECT,
//     CREATE,
//     JOIN,
//     LEAVE,
//     START_GAME,
//     END_GAME,
//     LOSE_GAME,
//     PIECE,
//     LINES_PENALTY,
//     SPECTRUM,
//     CHAT,
//     GET_GAMES,
//     GET_PLAYERS,
//     CHECK_LEADER,
//     AUTH_ERROR

// }

exports.piecesArray = piecesArray
