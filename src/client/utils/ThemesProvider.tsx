import React from 'react'
import { createMuiTheme, ThemeProvider as ThemeProviderMaterialUI } from '@material-ui/core'
import { ThemeProvider as ThemeProviderEmotion } from '@emotion/react'

function ThemesProvider({ children }: { children: React.ReactNode }) {

  const themeMaterial = createMuiTheme({
    typography: {
      fontFamily: 'Audiowide, cursive',
    },
    palette: {
      primary: {
        main: '#ff0000'
      }
    }
  })

  const themeEmotion = {
    colors: {
      primary: '#ff0000',
      text1: 'white',
      text2: '#ff0000',
      light: 'white',
      dark: '#151515',
      lightGrey: '#d8d8d8',
      darkGrey: '#202020',
    }
  }

  return (
    <ThemeProviderMaterialUI theme={themeMaterial}>
      <ThemeProviderEmotion theme={themeEmotion}>
        {children}
      </ThemeProviderEmotion>
    </ThemeProviderMaterialUI>
  )
}

export default ThemesProvider