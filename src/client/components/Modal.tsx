/** @jsx jsx */
import { jsx } from '@emotion/react'
import { motion, AnimatePresence } from 'framer-motion'
import CloseIcon from '@material-ui/icons/Close'

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
                            position: 'relative',
                            '@media (max-width: 800px)': {
                                width: '90%'
                            }
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
                                color: 'black',
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