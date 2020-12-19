/** @jsx jsx */
import { jsx } from '@emotion/react'

function LittleGridSpectrum({ position, playerId }: any) {
    return (
        <div
            css={{
                gridArea: `little_grid_${position + 1}`
            }}
        >
            little grid
            with the spectrum of the player: {playerId}

        </div>
    )
}

export default LittleGridSpectrum
