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
    margin: 0,
})

export const Main = styled.div({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexGrow: 1,
    flexWrap: 'wrap',
    backgroundColor: 'black'
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

const cellsColors: { [index:string] : any } = {
    "I": {
        cell: "blue",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"
    },
    "J": {
        cell: "blue",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"
    },
    "L": {
        cell: "blue",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"
    },
    "T": {
        cell: "blue",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"
    },
    "O": {
        cell: "blue",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"
    },
    "S": {
        cell: "blue",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"
    },
    "Z": {
        cell: "blue",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"
    },
    "*": {
        cell: "blue",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"
    },
    "": {
        cell: "grey",
        top: "rgba(238, 229, 229, 0.863)",
        bottom: "#000099",
        left: "#0000cc",
        right: "#0000cc"    
    }

}


export const Cell = ({ value }: { value: string }) => {
    return (
        <div className="cell"
            css={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: cellsColors[value].cell,
            }}
        >
            <div 
                id="top-shape"
                css={{
                                        position: 'absolute',
                    width: '100%',
                    height: '100%',
                    clipPath: "polygon(0% 0%, 15% 15%, 85% 15%, 100% 0%)",
                    backgroundColor: cellsColors[value].top,
                }}
            />

            <div 
                id="right-shape"
                css={{
                                        position: 'absolute',
                    width: '100%',
                    height: '100%',
                    clipPath: "polygon(100% 0%, 85% 15%, 85% 85%, 100% 100%)",
                    backgroundColor: cellsColors[value].right,
                }}
                />

            <div 
                id="bottom-shape"
                css={{
                                        position: 'absolute',
                    width: '100%',
                    height: '100%',
                    clipPath: "polygon(0% 100%, 15% 85%, 85% 85%, 100% 100%)",
                    backgroundColor: cellsColors[value].bottom,
                }}
                />

            <div 
                id="left-shape"
                css={{
                                        position: 'absolute',
                    width: '100%',
                    height: '100%',
                    clipPath: "polygon(0% 0%, 15% 15%, 15% 85%, 0% 100%)",
                    backgroundColor: cellsColors[value].left,
                }}
            />
        </div>
    )
}