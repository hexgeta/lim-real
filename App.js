import React, { useState, useEffect } from 'react';
import InputGroup from './components/InputGroup';
import SliderGroup from './components/SliderGroup';
import PoolStats from './components/PoolStats';
import { fetchHexData, fetchPulsechainPrice, fetchGasPrice } from './api';
import { calculatePoolStats, calculateSoloStats, calculateHEXGas } from './utils';
import './App.css';

function App() {
  const [hexData, setHexData] = useState({
    price: 0,
    payoutPerTshare: 0,
    tshareRate: 0,
  });
  const [pulsePrice, setPulsePrice] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [raisedHex, setRaisedHex] = useState(100000);
  const [stakeLength, setStakeLength] = useState(1555);
  const [organiserFee, setOrganiserFee] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const [hexData, pulsePrice, gasPrice] = await Promise.all([
        fetchHexData(),
        fetchPulsechainPrice(),
        fetchGasPrice(),
      ]);
      setHexData(hexData);
      setPulsePrice(pulsePrice);
      setGasPrice(gasPrice);
    };
    fetchData();
  }, []);

  const poolStats = calculatePoolStats(raisedHex, stakeLength, organiserFee, hexData);
  const soloStats = calculateSoloStats(raisedHex, stakeLength, hexData);
  const hexGas = calculateHEXGas(gasPrice, pulsePrice, hexData.price, soloStats.hexYield);

  return (
    <div className="container">
      <InputGroup value={raisedHex} onChange={setRaisedHex} />
      <SliderGroup
        stakeLength={stakeLength}
        organiserFee={organiserFee}
        onStakeLengthChange={setStakeLength}
        onOrganiserFeeChange={setOrganiserFee}
      />
      <PoolStats
        poolStats={poolStats}
        soloStats={soloStats}
        hexGas={hexGas}
        hexData={hexData}
      />
    </div>
  );
}

export default App;