import io from 'socket.io-client'
import { SOCKET } from '../config/constants.json'
let socket : SocketIOClient.Socket

interface CallbackFunction {
    (error: string | null, data?: any): void
}

export const initiateSocket = () => {
    socket = io('/')
    console.log('Initiating socket...')
}

export const subscribeToEvent = (eventName: string, cb: CallbackFunction) => {
    if (socket)
        socket.on(eventName, (error: string | null, data: any) => {
            if (error === SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                return disconnectSocket()
            return cb(error, data)
        })
    else {
        disconnectSocket()
    }
}

export const cancelSubscribtionToEvent = (eventName: string) => {
    if (socket) {
        if (eventName)
            socket.off(eventName)
    }
    else {
        disconnectSocket()
    }
}

export const emitToEvent = (eventName: string, data?: any) => {
    if (socket) {
        socket.emit(eventName, data)
    }
    else {
        disconnectSocket()
    }
}

export const emitToEventWithAcknowledgement = (
        eventName: string,
        data: any,
        cb: CallbackFunction,
    ) => {
    if (socket)
        socket.emit(eventName, data, cb)
    else {
        disconnectSocket()
    }
}

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket...')
        socket.disconnect()
    }
    window.location.href = '/'
}
