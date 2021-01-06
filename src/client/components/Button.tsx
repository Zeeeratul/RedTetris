/** @jsx jsx */
import { jsx } from '@emotion/react'

export function Button({ title, action, disabled = false }: { title: string, action: any, disabled?: boolean }) {

    return (
        <button
            disabled={disabled}
            css={{
                fontFamily: 'Audiowide, cursive',
                fontSize: '26px',
                height: '60px',
                width: '200px',
                border: 'none',
                borderRadius: '10px',
                boxShadow: `
                    3px 3px black
                `,
                color: 'white',
                backgroundColor: '#303030',
                marginTop: '20px',
                outline: 'none',
                transition: '100ms ease-out',
                '&:hover': {
                    backgroundColor: '#282828'
                },
                '&:active': {
                    backgroundColor: '#202020',
                    transition: '200ms ease-out',
                    boxShadow: 'none',
                    transform: 'translate(3px, 3px)'
                },
                '&:disabled': {
                    opacity: '0.5',
                    transition: '200ms ease-out',
                }
            }}
            onClick={action}
        >
            {title}
        </button>
    )
}