import io from 'socket.io-client'
let socket

const options = {
    forceNew: true
}

export const initiateSocket = () => {
    if (socket)
        return

    const token = localStorage.getItem('red_tetris_token')

    if (token) {
        console.log('Initiating socket private route...')
        socket = io('/auth', {
            ...options,
            query: {
                token
            }
        })
    }
    else {
        console.log('Initiating socket public route...')
        socket = io('/', options)
    }
}

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket...')
        socket.disconnect()
        socket = null
    }
}

export const disconnectUser = () => {
    console.log('Disconnecting user...')
    if (socket) {
        socket.disconnect()
        socket = null
    }
    localStorage.removeItem('red_tetris_token')
    window.location = '/'
}

export const subscribeToEvent = (eventName, cb) => {
    if (socket)
        socket.on(eventName, (response) => {
            console.log(`Websocket event: '${eventName}' received!`)
            return cb(response)
        })
}

export const emitToEvent = (eventName, data = {}, cb = null) => {
    if (socket) {
        if (cb) {
            socket.emit(eventName, data, cb)
        }
        else {
            socket.emit(eventName, data)
        }
    }
}

export const checkConnection = () => {
    // if (socket.c)
}