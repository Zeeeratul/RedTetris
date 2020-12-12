import React, { useContext, useState } from 'react'
import { ThemeContext } from '../utils/useTheme'
import '../styles/Game.css'
import Grid from '../components/game/Grid'
import { Navbar, Footer, Main, PageContainer, Columm } from '../components/Template'


// const regex = new RegExp('^#[a-zA-Z0-9]*[[a-zA-Z0-9]*]$')

function Game() {

    const [gameStatus, setGameStatus] = useState('started')
  
    return (
        <PageContainer>
            <Navbar />

            <Main>
                <Grid />

            </Main>

            <Footer />
        </PageContainer>
    )
}

export default Game
