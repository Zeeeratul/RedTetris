import _ from 'lodash'
import Player from './Player'

type PlayerType = {
    id: number,
    username: string,
    currentPieceIndex: number,
}

class Players {
    players: PlayerType[]
    constructor() {
        this.players = []
    }

    // addPlayer(username: string, id: string) {
    //     const player = new Player({ username, id })
    //     this.players.push(player)
    //     console.log(`Players.js: login player created: `, player.username)
    //     return player
    // }

    // removePlayer(username: string) {
    //     const index = _.findIndex(this.players, { username })
    
    //     // remove the player
    //     this.players.splice(index, 1)
    // }


}

export default Players
