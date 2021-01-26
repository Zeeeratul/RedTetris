/** @jsx jsx */
import { jsx } from '@emotion/react'
import styled from '@emotion/styled/macro'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { disconnectSocket } from '../../client/middlewares/socket'
import { useHistory } from "react-router-dom"
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'

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

    const history = useHistory()

    const logout = () => disconnectSocket()
    const leaveGame = () => history.replace('/games')

    return (
        <nav
            css={{
                gridArea: 'header',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: '5px'
            }}
        >
            <h1 
                css={{
                    color: 'red',
                    fontSize: '40px',
                    marginLeft: '10px',
                    '@media (max-width: 500px)': {
                        fontSize: '30px'
                    }
                }}
            >
                Red Tetris
            </h1>
            <div
                css={{
                    display: 'flex',
                }}
            >
                {userInGame &&
                    <RoundButton
                        title="Leave Game"
                        onClick={leaveGame}
                    >
                        <MeetingRoomIcon 
                            fontSize='large'
                            css={(theme: any) => ({
                                color: theme.colors.text2,
                            })}
                        />
                    </RoundButton>
                }
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
            </div>
        </nav>
    )
}