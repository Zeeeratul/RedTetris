import { createContext } from 'react'

const UserContext = createContext({
    username: '',
    id: ''
})

export { UserContext }