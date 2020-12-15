import io from 'socket.io-client'
let socket : any

export const initiateSocket = () => {
    socket = io('/')
    console.log('Initiating socket...')
}

export const subscribeToEvent = (eventName: string, cb: (res: {}) => any) => {
    if (socket)
        socket.on(eventName, (response: {}) => {
            console.log(`Websocket event: '${eventName}' received!`)
            return cb(response)
        })
}

export const emitToEvent = (eventName: string, data?: {} | string, cb?: (res: any) => any) => {
    if (socket) {
        if (cb) {
            socket.emit(eventName, data, cb)
        }
        else {
            socket.emit(eventName, data)
        }
    }
    else {
        window.location.href = '/landing'
    }
}

export const checkSocketConnection = () => {
    if (!socket || !socket.connected) {
        disconnectSocket()
        return false
    }
    else 
        return true
}

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket...')
        socket.disconnect()
    }
    window.location.href = '/landing'
}
