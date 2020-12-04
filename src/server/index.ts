import express from 'express'
import http from 'http'
import path from 'path'
import Sockets from './class/Sockets'
require('dotenv').config()
const port = process.env.PORT || 4000



class Server {
    app: express.Application;
    http: any;
    sockets: any;

    constructor() {
        this.app = express()
        this.http = http.createServer(this.app)
        this.sockets = new Sockets(this.http).listenToEvents()
    }

    listen() {
        this.app.use(express.static(path.join(__dirname, '../../build')))
        this.app.get('/*', (_: any, res: any) => res.sendFile(path.join(__dirname, '../../build', 'index.html')))
        this.http.listen(port, () => console.log(`Our app is running on http://localhost:${ port }`))
    }
}

const server = new Server()

server.listen()