import io from 'socket.io-client'
import { SOCKET } from '../config/constants.json'
let socket : SocketIOClient.Socket

export const initiateSocket = () => {
    socket = io('/')
    console.log('Initiating socket...')
}

export const subscribeToEvent = (eventName: string, cb: CallbackFunction) => {
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

    const WrapCallback = (error: SocketError, data: any) => {
        if (error === SOCKET.SERVER_ERROR.USER_NOT_CONNECTED)
            return disconnectSocket()
        return cb(error, data)
    }
    
    if (socket)
        socket.emit(eventName, data, WrapCallback)
    else {
        disconnectSocket()
    }
}

export const emitToEventWithAcknowledgementPromise = (
        eventName: string,
        data: any,
    ) => {

    return new Promise((resolve, reject) => {
        socket.emit(eventName, data, (error: SocketError, data: any) => {
            console.log(data)

            if (error)
                reject(error)
            resolve(data)
        })

    })
        // socket.emit(eventName, data, (error: SocketError, data: any) => {
        //     console.log(error, data)
        //     if (error)
        //         return error
        //     return data
        // })


    // const WrapCallback = (error: SocketError, data: any) => {
    //     return new Promise((resolve, reject) => {
    //         if (error)
    //             reject(error)
    //         resolve(data)
    //     })
    // }
    
}

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket...')
        socket.disconnect()
    }
    window.location.href = '/'
}
