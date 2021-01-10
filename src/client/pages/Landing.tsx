/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { Fragment, useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { ErrorBoundary } from 'react-error-boundary'
import { initiateSocket, emitToEventWithAcknowledgement } from '../middlewares/socket'
import { SOCKET } from '../config/constants.json'
import background from '../assets/tetris-background.jpg'
import { PageContainer, Navbar } from '../components/Template'
import { makeStyles, Paper } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'


// import { motion, AnimatePresence } from 'framer-motion'


// const variants = {
//     hidden: { 
//         opacity: 0,
//         x: "-100px"

//     },
//     visible: {
//         x: "50vw",
//         opacity: 1,
//         delay: 2
//     },
//     exit: {
//         opacity: 0,
//         x: "100vw" 
//     }
// }

// function Combo({ toggle, setToggle }: { toggle: boolean, setToggle: any }) {

//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             setToggle(false)
//         }, 2000)
        
//         return () => {
//             clearTimeout(timeout)
//         }
//     }, [toggle, setToggle])

//     return (
//         <AnimatePresence exitBeforeEnter>
//         {toggle &&
//             <motion.div
//                 css={{
//                     position: 'absolute',
//                     top: '200px',
//                     // left: '-200px',
//                     background: 'white'
//                 }}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//                 variants={variants}
//             >
//                 <p>
//                     Combo!
//                 </p>
//             </motion.div>
//         }
//         </AnimatePresence>
//     )
// }



function Landing({ setUser }: any) {
    const history = useHistory()
    const [error, setError] = useState('')
    useEffect(() => {
        initiateSocket()
    }, [])
    
    const [toggle, setToggle] = useState(false)

    const handleSubmit = (ev: any) => {
        ev.preventDefault()
        const { username } = ev.target.elements
        if (username.value) {
            emitToEventWithAcknowledgement(SOCKET.AUTH.LOGIN, username.value, (error, data) => {
                if (error) {
                    console.log(error)
                    setError(error)
                }
                else {
                    setUser(data)
                    history.push('/games')
                }
            })

        }
    }

    if (error === 'socket_not_connected')
        throw new Error(error)


    return (
        <Fragment>
        {/* <Combo toggle={toggle} setToggle={setToggle} /> */}

        <PageContainer
            backgroundImage={`url(${background})`}
            backgroundPosition="center"
        >
            <Navbar />
            <div
                css={{
                    gridArea: 'main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper 
                    elevation={3}
                    css={(theme: any) => css({
                        backgroundColor: `${theme.colors.dark} !important`,
                        width: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '60px 10px',
                    })}   

                    onClick={() => setToggle(!toggle)}
                >   
                    <form
                        onSubmit={handleSubmit}
                        css={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <label
                            css={(theme: any) => ({
                                fontSize: '38px',
                                marginBottom: '20px',
                                color: theme.colors.text1,
                                '@media (max-width: 550px)': {
                                    fontSize: '28px',
                                }
                            })}
                            htmlFor="username"
                        >
                            what's your username ?
                        </label>
                        <div
                            css={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <input
                                id="username"
                                name="username"
                                maxLength={15}
                                autoFocus
                                css={(theme: any) => ({
                                    width: '400px',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    borderBottom: `2px solid ${theme.colors.text1}`,
                                    textAlign: 'center',
                                    paddingBottom: '15px',
                                    letterSpacing: '3px',
                                    fontSize: '24px',
                                    color: theme.colors.text1,
                                    fontFamily: 'Audiowide, cursive',
                                    '@media (max-width: 550px)': {
                                        fontSize: '18px',
                                        width: '250px'
                                    },
                                    '&:focus': {
                                        // color: 'blue',
                                        // borderBottom: '2px solid grey',
                                    }
                                })}
                            />
                        </div>
                        {error && 
                            <p
                                css={{
                                    marginTop: '30px',
                                    marginBottom: '0px',
                                    color: 'red',
                                    fontSize: '22px'
                                }}
                            >
                                {error}
                            </p>
                        }
                    </form>
                </Paper>
            </div>
        </PageContainer>
        </Fragment>

    )
}

export default Landing