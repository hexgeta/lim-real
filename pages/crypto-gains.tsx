import React from 'react';
import VsGainsHEX from '../components/vsgainshex';
import VsGainsNew from '../components/vsgainsnew-archive';
import VsGainsRHTickers from '../components/vsgainsrhtickers';
import VsGainsEverything from '../components/vsgainseverything';


const CryptoGains = () => {
  return (
    <div className="p-4">
      <VsGainsHEX/>
      {/* <VsGainsNew/> */}
      <VsGainsRHTickers/>
      <VsGainsEverything/>
    </div>
  );
};

export default CryptoGains;