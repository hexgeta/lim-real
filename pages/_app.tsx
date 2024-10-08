import '../styles/global.css';
import React from 'react';
import type { AppProps } from 'next/app';
import NavigationBar from '../components/NavBar';
import Footer from '../components/Footer';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <NavigationBar />
    <div className="App">
      <Component {...pageProps} />
    </div>
    <Footer/>
    </>
  );
}

export default App;