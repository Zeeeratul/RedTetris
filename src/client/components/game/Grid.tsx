/** @jsx jsx */
import { jsx } from '@emotion/react'
import useEventListener from '@use-it/event-listener'
import { emitToEvent } from '../../middlewares/socket'
import Line from './Line'

function Grid({ piece, grid, dispatch }: any) {
    
    const handleKeyboard = (key: string) => {
        switch (key) {
            case 'ArrowRight':
                dispatch({ type: 'move_horizontal', xDirection: 1 })
                break;
            case 'ArrowLeft':
                dispatch({ type: 'move_horizontal', xDirection: -1 })
                break;
            case 'ArrowDown':
                dispatch({ type: 'move_vertical' })
                break;
        
            default:
                console.info(`Unbinded key: ${key}`)
                break;
        }
    }

    // const { grid, nextPiece } = state
    // const [currentPiece, setCurrentPiece] = useState(piece)
    // console.log('render?')
    // useEffect(() => {
    //     // on piece changing change state but it rerender two times ?
    //     // setCurrentPiece(piece)
    // }, [piece])

    const getPiece = () => emitToEvent('piece')

    useEventListener('keydown', ({ key }: { key: string }) => handleKeyboard(key))

    return (
        <div 
            css={{
                width: '300px',
                height: '600px',
                display: 'grid',
                gridTemplateRows: 'repeat(22, minmax(0, 1fr))',
                gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                columnGap: '3px',
                rowGap: '3px',
                backgroundColor: 'black',
            }}
        >
            {grid.map((line: any, index: number) => (
                <Line
                    key={`line_${index}`} 
                    piecePositions={piece.positions}
                    pieceType={piece.type}
                    cells={line}
                    yCoord={index}

                />
            ))}
{/* 
            <button onClick={getPiece}>
                Piece
            </button> */}
        </div>
    )
}

export default Grid
