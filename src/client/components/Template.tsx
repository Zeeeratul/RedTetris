/** @jsx jsx */
import { jsx } from '@emotion/react'
import styled from '@emotion/styled/macro'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { motion, AnimatePresence } from 'framer-motion'
import { disconnectSocket } from '../../client/middlewares/socket'
import CloseIcon from '@material-ui/icons/Close';

type PageContainerProps = {
    backgroundImage?: string
    backgroundPosition?: string
}

export const PageContainer = styled.div({
        minHeight: '100vh',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: "1fr",
        gridTemplateRows: '70px auto 70px',
        gridTemplateAreas: `
            "header"
            "main"
            "footer"
        `
    },
    (props: PageContainerProps) => ({
        backgroundImage: props.backgroundImage ? props.backgroundImage : '',
        backgroundPosition: props.backgroundPosition ? props.backgroundPosition : '',
    })
)

const RoundButton = styled.button((props: any) => ({
    background: props.theme.colors.light,
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0px 5px',
    '&:hover': {
        background: props.theme.colors.lightGrey,
        transition: '300ms ease-in-out'
    },
}))

export const Navbar = ({ userConnected = false, userInGame = false }: { userConnected?: boolean, userInGame?: boolean }) => {

    const logout = () => disconnectSocket()

    return (
        <nav
            css={{
                gridArea: 'header',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <h1 
                css={{
                    color: 'red',
                    fontSize: '40px',
                    marginLeft: '10px'
                }}
            >
                Red Tetris
            </h1>
            {userConnected &&
                <RoundButton
                    title="Logout"
                    onClick={logout}
                >
                    <ExitToAppIcon 
                        fontSize='large'
                        css={(theme: any) => ({
                            color: theme.colors.text2,
                        })}
                    />
                </RoundButton>
            }
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
                        css={(theme: any) => ({
                            margin: "0 auto",
                            padding: "20px 20px",
                            width,
                            color: 'white',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            position: 'relative'
                        })}
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
                                color: 'white',
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