/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useContext, Fragment } from 'react'
import _ from 'lodash'
import Grid from './Grid'
import LittleGridSpectrum from './LittleGridSpectrum'
import { UserContext } from '../../utils/userContext'

function StartedGame({ players }: { players: any}) {
    
    const { id: userId } = useContext(UserContext)

    return (
        <Fragment>
            <Grid />

            {_.filter(players, (o: any) => o.id !== userId).map((player: any, index: number) => (
                <LittleGridSpectrum
                    key={`${player.id}`}
                    spectrum={player.spectrum}
                    position={index}
                    playerStatus={player.status}
                />
            ))}
        </Fragment>
    )
}

export default StartedGame
