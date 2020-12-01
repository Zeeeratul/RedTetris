require('dotenv').config()
const port = process.env.PORT || 4000
const express = require('express')
const app = express()
const http = require('http')
const path = require('path')

const { Sockets } = require('./class/Sockets')

class Server {
    constructor(app, http) {
        this.app = app
        this.http = http.createServer(this.app)
        this.sockets = new Sockets(this.http).listenToEvents()
    }

    listen() {
        this.app.use(express.static(path.join(__dirname, '../../build')))
        this.app.get('/*', (_, res) => res.sendFile(path.join(__dirname, '../../build', 'index.html')))
        this.http.listen(port, () => console.log(`Our app is running on http://localhost:${ port }`))
    }
}

const server = new Server(app, http)

server.listen()