import io from 'socket.io-client'
let socket : any

interface CallbackFunction {
    (error: string | null, data?: any): void
}

export const initiateSocket = () => {
    socket = io('/')
    console.log('Initiating socket...')
}

export const subscribeToEvent = (eventName: string, cb: CallbackFunction) => {
    if (socket)
        socket.on(eventName, (error: any, data: any) => {
            console.log(`Websocket event: '${eventName}' received!`)
            return cb(error, data)
        })
}

export const cancelSubscribtionToEvent = (eventName?: string) => {
    if (eventName) {
        socket.off(eventName)
    }
}

export const emitToEvent = (eventName: string, data?: any) => {
    console.log(eventName, data)
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
        cb: CallbackFunction,
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
