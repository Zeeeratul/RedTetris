import styled from '@emotion/styled'

export const PageContainer = styled.div({
    background: 'black',
    height: '100vh',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '@media (max-width: 700px)': {
        height: '200vh'
    }
})

export const Main = styled.main({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: '1',
    flexWrap: 'wrap',
    // backgroundColor: 'white',
    backgroundColor: '#12181b'
})

export const Navbar = styled.nav({
    width: '100%',
    height: '60px',
    background: 'black',
    borderBottom: '1px solid lightgrey',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
})

export const Footer = styled.footer({
    display: 'flex',
    borderTop: '1px solid lightgrey',
    height: '30px',
    justifyContent: 'flex-end',
    paddingRight: '10px',
    alignItems: 'center'
})


// export const Column = styled.div({

// })