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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}
        >
            <p css={{ margin: 0, background: 'cyan', color: 'black', textAlign: 'center', width: '100%', alignSelf: 'flex-start' }}>Next</p>
            <div
                css={{
                    display: 'grid',
                    margin: 'auto',
                    gridTemplateColumns: "20px 20px 20px 20px",
                    gridTemplateRows: "20px 20px"
                }}
            >
                {piece}
            </div>

        </div>
    )
}