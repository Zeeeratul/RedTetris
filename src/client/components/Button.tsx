/** @jsx jsx */
import { jsx } from '@emotion/react'

export function Button({ title, action, disabled = false, cssOverride }: { title: string, action: any, disabled?: boolean, cssOverride?: any }) {

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
                marginTop: '20px',
                outline: 'none',
                transition: '100ms ease-out',
                '&:hover': {
                    opacity: ''
                },
                '&:active': {
                    backgroundColor: '#D3D3D3',
                    transition: '200ms ease-out',
                    boxShadow: 'none',
                    transform: 'translate(3px, 3px)'
                }

            }}
            onClick={action}
        >
            {title}
        </button>
    )
}