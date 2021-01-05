/** @jsx jsx */
import { jsx } from '@emotion/react'
import styled from '@emotion/styled/macro'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { motion, AnimatePresence } from 'framer-motion'
import { disconnectSocket } from '../../client/middlewares/socket'
import CloseIcon from '@material-ui/icons/Close';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

export const PageContainer = styled.div((cssOverride) : any => ({
    background: 'white',
    minHeight: '100vh',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    // ...cssOverride
}))

export const Main = styled.div({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexGrow: 1,
    flexWrap: 'wrap',
    backgroundColor: 'white'
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
                height: '64px',
                background: '#333',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}
        >
            <div
                css={{
                    position: 'relative'
                }}
            >
                <button
                    title="LeaveGame"
                    css={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        marginRight: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                            background: 'grey',
                            transition: '300ms ease-in-out'
                        }
                    }}
                    // onClick={logout}
                >
                    <MeetingRoomIcon 
                        fontSize='default'
                        css={{
                            color: 'white',
                            opacity: '1',
                            // opacity: '0.75',
                            // '&:hover': {
                            //     opacity: '1',
                            //     transition: '150ms ease-in-out'
                            // }
                        }}
                    />
                </button>
                {/* {false &&
                    <p
                        css={{
                            position: 'absolute',
                            top: '38px',
                            padding: '8px 6px',
                            backgroundColor: 'grey',
                            textAlign: 'center',
                            fontSize: '14px',
                            border: '1px solid grey',
                            borderRadius: '6px',
                        }}
                    >Leave game</p>
                } */}

            </div>

            <div
                css={{
                    position: 'relative'
                }}
            >
                <button
                    title="Logout"
                    css={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        marginRight: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                            background: 'grey',
                            transition: '300ms ease-in-out'
                        },
                        // '&:after': {
                        //     backgroundColor: 'red',
                        //     width: '100px',
                        //     height: '100px',
                        // }
                    }}
                    onClick={logout}
                >
                    <ExitToAppIcon 
                        fontSize='default'
                        css={{
                            color: 'white',
                            opacity: '1',
                            // opacity: '0.75',
                            // '&:hover': {
                            //     opacity: '1',
                            //     transition: '150ms ease-in-out'
                            // }
                        }}
                    />
                </button>
                {/* <p
                    css={{
                        position: 'absolute',
                        top: '38px',
                        right: '10px',
                        padding: '8px 6px',
                        backgroundColor: 'grey',
                        textAlign: 'center',
                        fontSize: '14px',
                        border: '1px solid grey',
                        borderRadius: '6px',
                    }}
                >Logout</p> */}

            </div>

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


export const Modal = ({ isOpen, close, children, width = '400px' }: { isOpen: boolean, close: any, children: React.ReactNode, width?: string }) => {

    const backdrop = {
        visible: {
            opacity: 1
        },
        hidden: {
            opacity: 0
        }
    }

    const modal = {
        hidden: {
            y: "-100vh",
            opacity: 0,
        },
        visible: {
            y: "200px",
            opacity: 1,
            transition: {
                delay: 0.5
            }
        }
    }

    const closeWithNoClickPropagation = (ev: any) => {
        if (ev.target === ev.currentTarget)
            close()
    }

    return (
        <AnimatePresence exitBeforeEnter>
            {isOpen && (
                <motion.div
                    onClick={closeWithNoClickPropagation}
                    id="backdrop"
                    css={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,

                    }}
                    variants={backdrop}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        id="modal"
                        css={{
                            margin: "0 auto",
                            padding: "20px 20px",
                            width,
                            background: 'white',
                            borderRadius: '10px',
                            position: 'relative'
                        }}
                        variants={modal}
                    >
                        <button
                            id="close-button"
                            css={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                border: 'none',
                                outline: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: 'transparent',
                                '&:hover': {
                                    background: '#D3D3D3',
                                    transition: '300ms ease-in-out'
                                }
                            }}
                            onClick={close}
                        >
                            <CloseIcon />
                        </button>

                    {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}