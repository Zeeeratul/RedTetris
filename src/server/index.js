require('dotenv').config()
const port = process.env.PORT || 3000
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

    useStaticFiles() {

        app.get('/', (req, res) => {
            res.send('Hello World!')
          })
          
          app.listen(port, () => {
              console.log(`Our app is running on port ${ port }`);
          })
        // path.join(__dirname, 'build'))
        // this.app.use(express.static(path.join(__dirname, 'public')))
        // this.app.use(express.static(path.join(__dirname, '../../public')))
        // this.app.use(express.static(path.join(__dirname, '../../build')))
        // this.app.use(express.static(path.resolve('../../build')))
        // this.app.get("/", function (req, res) {
        //     res.send("<h1>Hello World!</h1>")
        //   })
        // this.app.get('/*', (_, res) => res.sendFile(path.join(__dirname, '../../build', 'index.html')))

        // this.app.get('*', (_, res) => res.sendFile(path.resolve('build', 'index.html')))
    }

    // listen() {
    //     this.http.listen(port, () => console.log(`Red Tetris api listening at http://localhost:${port}`))
    // }
}

const server = new Server(app, http)

server.useStaticFiles()
// server.listen()