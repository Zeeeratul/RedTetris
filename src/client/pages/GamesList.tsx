/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, Fragment } from 'react'
import Paper from '@material-ui/core/Paper'
import { Button } from '../components/Button'
import CreateGameModal from '../components/gamesList/CreateGameModal'
import GamesListTable from '../components/gamesList/GamesListTable'
import { PageContainer } from '../components/PageContainer'
import { Navbar } from '../components/Navbar'
import background from '../assets/tetris-background.jpg'

const GamesList = () => {

    const [showModal, setShowModal] = useState(false)
    const [isMultiplayer, setIsMultiplayer] = useState(true)

    return (
        <Fragment>
            <CreateGameModal 
                isOpen={showModal}  
                isMultiplayer={isMultiplayer}
                close={() => {
                    setShowModal(false)
                    setIsMultiplayer(true)
                }}
            />
            <PageContainer
                backgroundImage={`url(${background})`}
                backgroundPosition="center"
            >
                <Navbar userConnected />
                <div
                    css={{
                        gridArea: 'main',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Paper elevation={3}
                        css={(theme: any) => css({
                            width: '100%',
                            maxWidth: '800px',
                            minHeight: '400px',
                            backgroundColor: `${theme.colors.dark} !important`,
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            '@media (max-width: 650px)': {
                                flexDirection: 'column',
                            }
                        })}   
                    >
                        <GamesListTable />
      
                        <div
                            css={{
                                display: 'flex',
                                height: '80%',
                                minHeight: '250px',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flex: 1,
                            }}
                        >
                            <h1
                                css={(theme: any) => ({
                                    color: theme.colors.text2,
                                    textAlign: 'center'
                                })}
                            >Create game</h1>
                            <div
                                css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Button 
                                    title="Multiplayer" 
                                    action={() => {
                                        setShowModal(true)
                                        setIsMultiplayer(true)
                                    }}
                                />  
                                <Button 
                                    title="Solo"
                                    action={() => {
                                        setShowModal(true)
                                        setIsMultiplayer(false)
                                    }} 
                                />
                            </div>
                        </div>
                    </Paper>
                </div>
            </PageContainer>
        </Fragment>
    )
}
    
export default GamesList