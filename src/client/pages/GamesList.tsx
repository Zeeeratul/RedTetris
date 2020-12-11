/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { Navbar, Footer, Main, PageContainer } from '../components/Template'
import { ButtonWithIcon } from '../components/Buttons'
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


    return (
        <PageContainer>
            <Navbar>
                <button
                    title="Logout"
                    css={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <ExitToAppIcon 
                        fontSize='large'
                        css={{
                            color: 'white',
                            opacity: '0.75',
                            '&:hover': {
                                opacity: '1',
                                transition: '150ms ease-in-out'
                            }
                        }}
                    />

                </button>
            </Navbar>
                
            <Main>
                <div
                    css={{
                        width: '50%',
                        minWidth: '350px',
                        maxHeight: '700px',
                        height: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >

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

                            {/* BODY */}
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
                </div>


                <div
                    css={{
                        width: '50%',
                        minWidth: '350px',
                        maxHeight: '700px',
                        display: 'flex',
                        height: '80%',

                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
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
                            name="username"
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
                        />
                        <button
                            css={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
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
                </div>

            </Main>

            <Footer>
                @cdelahay @frrobert
            </Footer>
            
        </PageContainer>
    )
}
    
export default GamesList