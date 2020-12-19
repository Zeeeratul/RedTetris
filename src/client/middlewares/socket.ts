import io from 'socket.io-client'
let socket : any

export const initiateSocket = () => {
    socket = io('/')
    console.log('Initiating socket...')
}

export const subscribeToEvent = (eventName: string, cb: (error: any, data: any) => void) => {
    if (socket)
        socket.on(eventName, (error: any, data: any) => {
            console.log(`Websocket event: '${eventName}' received!`)
            return cb(error, data)
        })
}

export const emitToEvent = (eventName: string, data?: any) => {
    if (socket) {
        socket.emit(eventName, data)
    }
    else {
        window.location.href = '/'
    }
}

export const emitToEventWithAcknowledgement = (
        eventName: string,
        data: any,
        cb: (error: any, data: any) => void,
    ) => {

    if (socket) {
        socket.emit(eventName, data, cb)
    }
    else {
        window.location.href = '/'
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
    window.location.href = '/'
}
