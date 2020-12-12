/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState } from 'react'
import { initiateSocket, emitToEvent } from '../middlewares/socket'
import { useHistory } from "react-router-dom"
import { Navbar, Footer, Main, PageContainer, Columm } from '../components/Template'
import { ButtonWithIcon } from '../components/Buttons'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SearchIcon from '@material-ui/icons/Search'
import CreateIcon from '@material-ui/icons/Create'
import SoloIcon from '@material-ui/icons/Person'

import styled from '@emotion/styled'


const Td = styled.td({
    padding: '12px 15px'
})

const Th = styled.th({
    padding: '12px 15px'
})

const Tr = styled.tr({
    borderBottom: '1px solid white',
    '&:nth-child(even)': {
        backgroundColor: 'grey'
    },

    '&:hover': {
        opacity: '0.75'
    }

})

const GamesList = () => {

    const history = useHistory()
    const [gameName, setGameName] = useState('')


    const createGame = () => {
        if (!gameName) return 
        emitToEvent('create', gameName, ({ url, error }: any) => {
            if (error) {
                console.error(error)
            }
            else {
                history.push(`/${url}`)
            }
        })
    }

    return (
        <PageContainer>
            <Navbar />
                
            <Main>
{/* 
                <Columm>

                    <h1>Games List</h1>

                    <div
                        id='input-search-container'
                        css={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '80%',
                            marginBottom: '30px',
                        }}
                    >
                        <input
                            id="search-game"
                            name="username"
                            placeholder="Find your game..."
                            maxLength={15}
                            css={{
                                minWidth: '250px',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                borderBottom: '2px solid white',
                                paddingBottom: '15px',
                                fontSize: '18px',
                                color: 'white',
                            }}
                        />
                        <button
                            css={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <SearchIcon
                                fontSize="large"
                                css={{
                                    color: "white",
                                    opacity: '0.75',
                                    marginLeft: '10px',
                                    '&:hover': {
                                        opacity: '1',
                                        transition: '400ms ease'
                                    },
                                    '&:active': {
                                        color: 'grey'
                                    }
                                }}
                            />
                        </button>
                    </div>

                    <div
                        id="table-container"
                        css={{
                            width: '80%',
                            maxHeight: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'scroll'
                
                        }}
                    >
                        <table
                            css={{
                                borderCollapse: 'collapse',
                                width: '100%',
                                overflow: 'hidden',
                                borderRadius: '5px 5px 0 0',
                            }}
                            >
                            <thead>
                                <Tr
                                    css={{
                                        backgroundColor: 'black',
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                    }}
                                >
                             
                                    <Th>
                                        Game Name
                                    </Th>

                                    <Th>
                                        Slots
                                    </Th>
                             
                                </Tr>
                            </thead>

                            <tbody>
                                <Tr>
                                    <Td>
                                        Zeeratul
                                    </Td>
                                    <Td>
                                        3 / 4
                                    </Td>
                                </Tr>
                       
                            </tbody>

                        </table>
        

                    </div>
                </Columm>
 */}

                <Columm>
                    <h1>Create game</h1>

                    <div
                        css={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '80%'
                        }}
                    >
                        <input
                            id="search-game"
                            name="game_name"
                            placeholder="Create your game..."
                            maxLength={15}
                            css={{
                                minWidth: '250px',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                borderBottom: '2px solid white',
                                paddingBottom: '15px',
                                fontSize: '18px',
                                color: 'white',
                            }}
                            onChange={(ev) => setGameName(ev.target.value)}
                            value={gameName}
                        />
                        <button
                            css={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={createGame}
                        >
                            <CreateIcon
                                fontSize="large"
                                css={{
                                    color: "white",
                                    opacity: '0.75',
                                    marginLeft: '10px',
                                    '&:hover': {
                                        opacity: '1',
                                        transition: '400ms ease'
                                    },
                                    '&:active': {
                                        color: 'grey'
                                    }
                                }}
                            />
                        </button>
                    </div>
                    
                    <ButtonWithIcon>
                        Play Solo
                        <SoloIcon
                            fontSize="large"
                        />
                    </ButtonWithIcon>
                </Columm>

            </Main>

            <Footer />
            
        </PageContainer>
    )
}
    
export default GamesList