import { AppProps } from 'next/app';
import { Container, createMuiTheme, CssBaseline, responsiveFontSizes, ThemeProvider } from '@material-ui/core';

import { AppContextProvider } from 'components/contexts/AppContext';
import theme from 'components/theme';
import React, { useEffect } from 'react';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  });

  return (
    <>
      <Head>
        <title>Days Ago</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          <CssBaseline />
          <Component {...pageProps} />;
        </AppContextProvider>
      </ThemeProvider>
    </>
  );
}
