/** @jsx jsx */
import { jsx } from '@emotion/react'
import React, { useState, useEffect, useContext } from 'react'

function Cell() {
    return (
        <div 
            css={{
                borderRadius: '6px',
                width: '100%',
                height: '100%',
                backgroundColor: 'grey',
            }}
        >

        </div>
    )
}

function Line() {

    return (
        <React.Fragment>
            <Cell />
            <Cell />
            <Cell />
            <Cell />
            <Cell />
            
            <Cell />
            <Cell />
            <Cell />
            <Cell />
            <Cell />

            
  
        </React.Fragment>
    )
}

export default Line
