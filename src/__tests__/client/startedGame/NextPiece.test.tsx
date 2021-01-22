import React from 'react'
import { render } from '@testing-library/react'
import { NextPiece } from '../../../client/components/startedGame/NextPiece'
import ThemesProvider from '../../../client/utils/ThemesProvider'

test('NextPiece renders without crashing I', () => {
    render(
        <ThemesProvider>
            <NextPiece pieceType="I" />
        </ThemesProvider>
    )
})

test('NextPiece renders without crashing O', () => {
    render(
        <ThemesProvider>
            <NextPiece pieceType="O" />
        </ThemesProvider>
    )
})

test('NextPiece renders without crashing T', () => {
    render(
        <ThemesProvider>
            <NextPiece pieceType="T" />
        </ThemesProvider>
    )
})

test('NextPiece renders without crashing J', () => {
    render(
        <ThemesProvider>
            <NextPiece pieceType="J" />
        </ThemesProvider>
    )
})

test('NextPiece renders without crashing L', () => {
    render(
        <ThemesProvider>
            <NextPiece pieceType="L" />
        </ThemesProvider>
    )
})

test('NextPiece renders without crashing S', () => {
    render(
        <ThemesProvider>
            <NextPiece pieceType="S" />
        </ThemesProvider>
    )
})

test('NextPiece renders without crashing Z', () => {
    render(
        <ThemesProvider>
            <NextPiece pieceType="Z" />
        </ThemesProvider>
    )
})

test('NextPiece renders without crashing empty', () => {
    render(
        <ThemesProvider>
            <NextPiece pieceType="" />
        </ThemesProvider>
    )
})
