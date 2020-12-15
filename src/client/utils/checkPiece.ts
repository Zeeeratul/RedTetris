
export const checkVerticalPosition = (positions: [], grid: [[]]) => {
    for (let i = 0; i < positions.length; i++) {
        const {x, y} = positions[i]
        if (y > 21)
            return false
        if (grid[y][x])
            return false
    }
    return true
}

export const checkHorizontalPosition = (positions: [], grid: [[]]) => {
    for (let i = 0; i < positions.length; i++) {
        const {x, y} = positions[i]
        if (x < 0 || x > 9)
            return false
        if (grid[y][x])
            return false
    }
    return true
}