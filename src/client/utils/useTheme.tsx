import { useState, useEffect, createContext } from 'react'

type ContextProps = { 
    theme: string,
    changeTheme: any
}

const ThemeContext = createContext<Partial<ContextProps>>({})

const useTheme = () => {

    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

    const changeTheme = () => {
        setTheme(theme => theme === 'light' ? 'dark': 'light')
    }

    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])

    return {
        theme,
        changeTheme
    }
}

export {
    useTheme,
    ThemeContext
} 