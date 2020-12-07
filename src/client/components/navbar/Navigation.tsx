import * as React from "react"
import { motion } from "framer-motion"
import { MenuItem } from './MenuItem'
import { disconnectSocket } from '../../middlewares/socket'


// DARK MODE
import Brightness7Icon from '@material-ui/icons/Brightness7'
import Brightness3Icon from '@material-ui/icons/Brightness3'

// LOGOUT
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

// LEAVE GAME
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'

const menuItems = [
    {
        text: "Dark Theme",
        icon: (<Brightness3Icon/>),
        action: () => {
            console.log('dark theme')
        }
    },
    {
        text: "Leave Game",
        icon: (<MeetingRoomIcon/>),
        action: () => {
            console.log('dark theme')
        }
    },
    {
        text: "Logout",
        icon: (<ExitToAppIcon/>),
        action: () => {
            disconnectSocket()
        }
    },
]

const NavVariants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
}

export const Navigation = () => (
    <motion.ul variants={NavVariants}>
        {menuItems.map((item, index) => (
            <MenuItem index={index} key={index} icon={item.icon} text={item.text} action={item.action} />
        ))}
    </motion.ul>
)
