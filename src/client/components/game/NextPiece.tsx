/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/react'
import { Cell } from './Cell'

function createPiece(pieceType: string): any {

    // Not nice but it's working ...
    switch (pieceType) {
        case 'I':
            return (
                <React.Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "4 / 5",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                </React.Fragment>
            )
        case 'O':
            return (
                <React.Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                </React.Fragment>
            )
        case 'T':
            return (
                <React.Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                </React.Fragment>
            )
        case 'S':
            return (
                <React.Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                </React.Fragment>
            )
        case 'Z':
            return (
                <React.Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                </React.Fragment>
            )
        case 'L':
            return (
                <React.Fragment>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                </React.Fragment>
            )
        case 'J':
            return (
                <React.Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell value={pieceType} />
                    </div>
                </React.Fragment>
            )
        default:
            return (
                <React.Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value="" />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value="" />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value="" />
                    </div>
                    <div
                        css={{
                            gridColumn: "4 / 5",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell value="" />
                    </div>
                </React.Fragment>
            )
    }
}

export function NextPiece({ pieceType }: { pieceType: string }) {

    const piece = createPiece(pieceType)

    return (
        <div
            css={{
                height: '120px',
                width: '110px',
                border: '10px solid cyan',
                borderLeft: 'none',
                background: 'cyan',
                display: 'flex',
                flexDirection: 'column',
                clipPath: "polygon(0% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 0% 100%)"
            }}
            >
                <p css={{ margin: 0, background: 'cyan', color: 'black', textAlign: 'center', width: '100%', alignSelf: 'flex-start' }}>Next</p>
                <div
                    css={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black',
                        clipPath: "polygon(0% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 0% 100%)",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        css={{
                            display: 'grid',
                            gridTemplateColumns: "20px 20px 20px 20px",
                            gridTemplateRows: "20px 20px",
                        }}
                    >
                        {piece}

                    </div>
                </div>
        </div>
    )
}