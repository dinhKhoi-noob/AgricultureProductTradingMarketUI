import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../src/components/layouts/Layout'
import LayoutContextProvider from '../src/context/LayoutContext'
import { deepPurple, indigo } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material'

function MyApp({ Component, pageProps }: AppProps) {

  const theme = createTheme({
    palette: {
      primary: indigo,
      secondary: deepPurple
    },
    typography:{
      fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;`,
      htmlFontSize: 14
    }
  });

  return(
    <ThemeProvider theme={theme}>
      <LayoutContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LayoutContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
