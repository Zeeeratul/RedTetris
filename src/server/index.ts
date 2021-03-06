import express from 'express'
import http from 'http'
import path from 'path'
import { Sockets } from './class/Sockets'
import chalk from 'chalk'

require('dotenv').config()
const port = process.env.PORT || 4000

class Server {
    app: express.Application;
    http: http.Server;
    sockets: Sockets;

    constructor() {
        this.app = express()
        this.http = http.createServer(this.app)
        this.sockets = new Sockets(this.http)
    }

    listen() {
        this.app.use(express.static(path.join(__dirname, '../client/')))
        this.app.get('/*', (_: any, res: any) => res.sendFile(path.join(__dirname, '../client/', 'index.html')))
        this.http.listen(port, () => console.log(chalk.cyan(`Our app is running on http://localhost:${ port }`)))
    }
}

const server = new Server()

server.listen()
server.sockets.listenToEvents()

export { Server }