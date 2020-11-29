require('dotenv').config()
const port = process.env.SERVER_PORT || 4000
const express = require('express')
const app = express()
const http = require('http')
const path = require('path')

const { Sockets } = require('./class/sockets')

class Server {
    constructor(app, http) {
        this.app = app
        this.http = http.createServer(this.app)
        this.sockets = new Sockets(this.http).listenToEvents()
    }

    useStaticFiles() {
        this.app.use(express.static(path.resolve('build')))
        this.app.get('*', (_, res) => res.sendFile(path.resolve('build', 'index.html')))
    }

    listen() {
        this.http.listen(port, () => console.log(`Red Tetris api listening at http://localhost:${port}`))
    }
}

const server = new Server(app, http)

server.useStaticFiles()
server.listen()