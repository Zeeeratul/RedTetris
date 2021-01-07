/** @jsx jsx */
import { jsx } from '@emotion/react'

export function Button({ title, action, disabled = false }: { title: string, action: any, disabled?: boolean }) {
    return (
        <button
            disabled={disabled}
            css={(theme: any) => ({
                fontFamily: 'Audiowide, cursive',
                fontSize: '26px',
                height: '60px',
                width: '200px',
                border: 'none',
                borderRadius: '10px',
                boxShadow: `
                    3px 3px black
                `,
                color: theme.colors.dark,
                backgroundColor: theme.colors.light,
                margin: '20px 10px',
                outline: 'none',
                transition: '100ms ease-out',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: theme.colors.lightGrey,
                },
                '&:active': {
                    transition: '200ms ease-out',
                    boxShadow: 'none',
                    transform: 'translate(3px, 3px)'
                },
                '&:disabled': {
                    opacity: '0.5',
                    transition: '200ms ease-out',
                    cursor: 'not-allowed'
                }
            })}
            onClick={action}
        >
            {title}
        </button>
    )
}