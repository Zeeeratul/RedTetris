/** @jsx jsx */
import { memo } from 'react'
import { jsx } from '@emotion/react'

function Column({ start, columnIndex }: { start: number, columnIndex: number }) {
    return (
        <div
            css={{
                gridColumn: `${columnIndex} / ${columnIndex + 1}`,
                gridRow: `${start} / -1`,
                background: '#d8d8d8'
            }}
        />
    )
}

function LittleGridSpectrum({ 
    gridPosition,
    spectrum,
    playerStatus,
    playerId
}: { 
    gridPosition: number,
    spectrum: number[],
    playerStatus: PlayerStatus,
    playerId: string
}) {
    return (
        <div
            css={{
                gridArea: `little_grid_${gridPosition + 1}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: '10px 0px'
            }}
        >
            <div
                css={(theme: any) => ({
                    width: '150px',
                    height: '300px',
                    border: `1px solid ${theme.colors.text2}`,
                    background: 'rgb(0 0 0 / 60%)',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    display: 'grid',
                    gridTemplateRows: 'repeat(20, minmax(0, 1fr))',
                    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                })}
            >
                {playerStatus === 'KO' &&
                    <div
                        css={{
                            background: 'black',
                            color: 'white',
                            zIndex: 2,
                            borderRadius: '4px',
                            gridColumn: '1 / 11',
                            gridRow: '9 / 13',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        KO
                    </div>
                }
                {spectrum.map((line, index) => (
                    <Column key={`column${playerId}${index}`} columnIndex={index + 1} start={line + 1} />
                ))}
            </div>
        </div>
    )
}

export default memo(LittleGridSpectrum)
