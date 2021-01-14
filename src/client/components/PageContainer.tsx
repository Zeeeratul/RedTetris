/** @jsx jsx */
import styled from '@emotion/styled/macro'

type PageContainerProps = {
    backgroundImage?: string
    backgroundPosition?: string
}

export const PageContainer = styled.div({
        minHeight: '100vh',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: "1fr",
        gridTemplateRows: '70px auto',
        gridTemplateAreas: `
            "header"
            "main"
        `
    },
    (props: PageContainerProps) => ({
        backgroundImage: props.backgroundImage ? props.backgroundImage : '',
        backgroundPosition: props.backgroundPosition ? props.backgroundPosition : '',
    })
)