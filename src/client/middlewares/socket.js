import io, { Manager } from 'socket.io-client'
let socket

const options = {
    forceNew: true,
    reconnectionAttempts: 2,
}

export const initiateSocket = () => {
    socket = io('/')
    console.log('Initiating socket...')
}

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket...')
        socket.disconnect()
    }
    window.location = '/landing'
}

export const subscribeToEvent = (eventName, cb) => {
    console.log('subscribeToEvent', socket)
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
