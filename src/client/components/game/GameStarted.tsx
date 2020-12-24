/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Navbar, Footer, Main, PageContainer } from '../Template'
import LittleGridSpectrum from './LittleGridSpectrum'
import Grid from './Grid'

function GameStared({ children, otherPlayers }: any) {

    return (
        <PageContainer>
            <Navbar />
            <Main
                css={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr',
                    gridTemplateRows: '50% 50%',
                    gridTemplateAreas: `
                        "little_grid_1 main_grid little_grid_2"
                        "little_grid_3 main_grid little_grid_4"
                    `
                }}
            >
                <Grid />

                {otherPlayers.map((player: any, index: number) => (
                    <LittleGridSpectrum
                        key={`${player.id}`}
                        position={index}
                        playerId={player.id}
                    />
                ))}
            </Main>
            <Footer />
        </PageContainer>
    )
}

export default GameStared
