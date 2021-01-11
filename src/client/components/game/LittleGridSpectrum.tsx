/** @jsx jsx */
import { jsx } from '@emotion/react'

function Column({ start, columnIndex }: { start: number, columnIndex: number }) {
    return (
        <div
            css={{
                gridColumn: `${columnIndex} / ${columnIndex + 1}`,
                gridRow: `${start} / 21`,
                background: 'grey'
            }}
        />
    )
}

function LittleGridSpectrum({ position, spectrum, playerStatus }: any) {

    return (
        <div
            css={(theme: any) => ({
                gridArea: `little_grid_${position + 1}`,
                justifySelf: "stretch",
                alignSelf: "normal",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            })}
        >
            <div
                css={(theme: any) => ({
                    width: '150px',
                    height: '300px',
                    border: `1px solid ${theme.colors.text2}`,
                    overflow: 'hidden',
                    borderRadius: '4px',
                    display: 'grid',
                    gridTemplateRows: 'repeat(20, minmax(0, 1fr))',
                    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                    opacity: playerStatus === "KO" ? '0.5' : 1
                })}
            >
                {playerStatus === 'KO' &&
                    <div
                        css={{
                            background: 'transparent',
                            gridColumn: '5 / 7',
                            gridRow: '10 / 12',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        KO
                    </div>
                }

                {spectrum.map((line: number, index: number) => (
                    <Column columnIndex={index + 1} start={line + 1} />
                ))}
            </div>

        </div>
    )
}

export default LittleGridSpectrum
