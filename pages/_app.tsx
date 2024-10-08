import '../styles/global.css';
import React from 'react';
import type { AppProps } from 'next/app';
import NavigationBar from '../components/NavBar';
import Footer from '../components/Footer';
import ThirtyDayPerformance from '../components/30DayPerformance';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <NavigationBar />
    <div className="App">
      <Component {...pageProps} />
      <ThirtyDayPerformance />
    </div>
    <Footer/>
    </>
  );
}

export default App;