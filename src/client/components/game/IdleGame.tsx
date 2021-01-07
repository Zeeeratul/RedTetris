/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect, useContext, Fragment } from 'react'
import _ from 'lodash'
import { emitToEvent, subscribeToEvent } from '../../middlewares/socket'
import { SOCKET } from '../../config/constants.json'
import { useHistory } from "react-router-dom"
import { Paper } from '@material-ui/core'


function IdleGame() {

    return (
        <div
            css={{
                gridArea: 'main_grid',
                display: 'flex',
                justifyContent: 'flex-end',
                background: 'white'
                // alignItems: 'center'
            }}
        >
        </div>
    )
}

export default IdleGame
