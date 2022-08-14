// import type { AppProps } from "next/app";
import { NextPage } from 'next'
import { StoreProvider } from 'store/index';
import Layout from '../components/layout';
import '../styles/globals.css'

interface IProps {
  initialValue: Record<any, any>,
  Component: NextPage,
  pageProps: any
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  const renderLayout = () => {
    if((Component as any).layout === null) {
      return <Component {...pageProps} />
    } else {
        return <Layout>
          <Component {...pageProps} />
        </Layout>
    }
  }

  return (
    <StoreProvider initialValue={initialValue}>
      {renderLayout()}
    </StoreProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avator } = ctx?.req?.cookies || {}
  return {
    initialValue: {
      user: {
        userInfo: {
          userId: Number(userId),
          nickname,
          avator,
        }
      }
    }
  }
}

export default MyApp
