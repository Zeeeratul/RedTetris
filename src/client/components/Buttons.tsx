import styled from '@emotion/styled'

export const ButtonWithIcon = styled.button({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    borderRadius: '8px',
    background: 'grey',
    padding: '10px 20px',
    width: '180px',
    fontSize: '24px',
    color: 'white',
    boxShadow: '3px 3px black',
    '&:hover': {
        opacity: '0.75',
        transition: '250ms ease-in-out'
    },
    '&:active': {
        transform: 'translate(3px, 3px)',
        boxShadow: 'none',
        transition: '250ms ease-in-out'
    }

})
