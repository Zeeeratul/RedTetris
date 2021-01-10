/** @jsx jsx */
import { jsx } from '@emotion/react'

export function Button({ title, action, disabled = false, className }: { title: string, action: any, disabled?: boolean, className?: string }) {
    return (
        <button
            disabled={disabled}
            className={className}
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
                color: theme.colors.text2,
                backgroundColor: theme.colors.light,
                margin: '10px 20px 0px 10px',
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