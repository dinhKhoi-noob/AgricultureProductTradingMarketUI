import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../src/components/layouts/Layout'
import LayoutContextProvider from '../src/context/LayoutContext'

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <LayoutContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LayoutContextProvider>
  )
}

export default MyApp
