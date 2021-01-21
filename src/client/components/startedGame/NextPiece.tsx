/** @jsx jsx */
import { Fragment } from 'react'
import { jsx } from '@emotion/react'
import { Cell } from './Line'

function createPiece(pieceType: PieceType): any {

    switch (pieceType) {
        case 'I':
            return (
                <Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "4 / 5",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                </Fragment>
            )
        case 'O':
            return (
                <Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                </Fragment>
            )
        case 'T':
            return (
                <Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                </Fragment>
            )
        case 'S':
            return (
                <Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                </Fragment>
            )
        case 'Z':
            return (
                <Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                </Fragment>
            )
        case 'L':
            return (
                <Fragment>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                </Fragment>
            )
        case 'J':
            return (
                <Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "2 / 3"
                        }}
                    >
                        <Cell pieceType={pieceType} />
                    </div>
                </Fragment>
            )
        default:
            return (
                <Fragment>
                    <div
                        css={{
                            gridColumn: "1 / 2",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType="" />
                    </div>
                    <div
                        css={{
                            gridColumn: "2 / 3",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType="" />
                    </div>
                    <div
                        css={{
                            gridColumn: "3 / 4",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType="" />
                    </div>
                    <div
                        css={{
                            gridColumn: "4 / 5",
                            gridRow: "1 / 2"
                        }}
                    >
                        <Cell pieceType="" />
                    </div>
                </Fragment>
            )
    }
}

export function NextPiece({ pieceType }: { pieceType: PieceType }) {
    const piece = createPiece(pieceType)

    return (
        <div
            css={(theme: any) => ({
                height: '120px',
                width: '110px',
                border: `15px solid ${theme.colors.text2}`,
                borderLeft: 'none',
                background: theme.colors.text2,
                display: 'flex',
                flexDirection: 'column',
                clipPath: "polygon(0% 0%, calc(100% - 15px) 0%, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%)"
            })}
        >
            <p css={(theme : any) => ({ margin: 0, background: theme.colors.text2, color: 'black', textAlign: 'center', width: '100%', alignSelf: 'flex-start' })}>Next</p>
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