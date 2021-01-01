/** @jsx jsx */
import { jsx } from '@emotion/react'

// if player is KO just print a KO
// else print the grid spectrum of player

function LittleGridSpectrum({ position, spectrum, playerStatus }: any) {

    if (playerStatus === 'KO') {
        return (
            <div
                css={{
                    gridArea: `little_grid_${position + 1}`
                }}
            >
                ko player

            </div>
        )
    }
    else {
        return (
            <div
                css={{
                    gridArea: `little_grid_${position + 1}`
                }}
            >
                little grid
    
            </div>
        )
    }
}

export default LittleGridSpectrum
