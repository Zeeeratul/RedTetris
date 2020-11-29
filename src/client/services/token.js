
const login = (token) => {
    localStorage.setItem('red_tetris_token', token)
}

const logout = () => {
    localStorage.removeItem('red_tetris_token')
}

export { login, logout }