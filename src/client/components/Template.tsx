/** @jsx jsx */
import { jsx } from '@emotion/react'
import styled from '@emotion/styled/macro'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { disconnectSocket } from '../../client/middlewares/socket'



export const PageContainer = styled.div({
    background: 'black',
    minHeight: '100vh',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
})

export const Main = styled.div({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexGrow: 1,
    flexWrap: 'wrap',
    backgroundColor: '#12181b'
})

export const Columm = styled.div({
    height: '500px',
    width: '400px',
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
 
})

export const Navbar = () => {

    const logout = () => {
        disconnectSocket()
        // window.location.href = '/landing'
    }

    return (
        <nav
            css={{
                width: '100%',
                height: '60px',
                background: 'black',
                borderBottom: '1px solid lightgrey',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
                    
            }}
        >
            <button
                    title="Logout"
                    css={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={logout}
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
        </nav>
    )
}

export const Footer = () => {
    return (
        <footer
            css={{
                display: 'flex',
                borderTop: '1px solid lightgrey',
                height: '30px',
                justifyContent: 'flex-end',
                paddingRight: '10px',
                alignItems: 'center'
            }}
        >
            @cdelahay @frrobert
        </footer>

    )
}
