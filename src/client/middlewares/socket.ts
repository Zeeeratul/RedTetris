import { connect } from 'socket.io-client'
import { SOCKET } from '../config/constants.json'
let socket : SocketIOClient.Socket

export const initiateSocket = () => {
    socket = connect('/')
}

export const subscribeToEvent = (eventName: string, cb: CallbackFunction) => {
    // if (socket && socket.connected)
    if (socket)
        socket.on(eventName, (error: SocketError, data: any) => {
            if (error === SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
                return disconnectSocket()
            return cb(error, data)
        })
    else {
        disconnectSocket()
    }
}

export const cancelSubscribtionToEvent = (eventName: string) => {
    if (socket && socket.connected) {
        if (eventName)
            socket.off(eventName)
    }
    else {
        disconnectSocket()
    }
}

export const emitToEvent = (eventName: string, data?: any) => {
    if (socket && socket.connected) {
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

    const WrapCallback = (error: SocketError, data: any) => {
        if (error === SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
            return disconnectSocket()
        return cb(error, data)
    }

    if (socket && socket.connected) {
        socket.emit(eventName, data, WrapCallback)
    }
    else {
        disconnectSocket()
    }
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
    }
    window.location.href = '/'
}