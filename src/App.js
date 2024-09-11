import React from 'react';
import DiscountChart from './components/DiscountChart';

function App() {
  const chartConfigs = [
    { tableName: 'pMAXI - DiscountChart', title: 'pMaxi Ⓜ️' },
    { tableName: 'pDECI - DiscountChart', title: 'pDECI 🛡️' },
    { tableName: 'pLUCKY - DiscountChart', title: 'pLUCKY 🍀' },
    { tableName: 'pTRIO - DiscountChart', title: 'pTRIO 🎲' },
    { tableName: 'pBASE - DiscountChart', title: 'pBASE 🟠' },
  ];

  return (
    <div className="App">
      {chartConfigs.map((config, index) => (
        <DiscountChart 
          key={index}
          tableName={config.tableName}
          title={config.title}
        />
      ))}
    </div>
  );
}

export default App;