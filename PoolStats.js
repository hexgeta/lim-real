import React from 'react';

function PoolStats({ poolStats, soloStats, hexGas, hexData }) {
  return (
    <div className="pool-stats">
      <h3 className="bold-text" id="header1">
        <span>Your Solo vs Pooled Stake Stats </span><span>🔥</span>
      </h3>
      
      <div className="spacer"></div>
      <h2 className="bold-text" id="header1">
        <span className="underhead">Solo-Stake</span>
      </h2>
      <p><strong>Solo End-stake Gas Cost in PLS: </strong> <span>{hexGas.gasCostInPls.toFixed(1)} PLS</span></p>
      <p><strong>Solo End-stake Gas Cost in $: </strong> <span>${hexGas.gasCostInUsd.toFixed(2)}</span></p>
      <p><strong>Solo End-stake Gas Cost in HEX: </strong> <span>{hexGas.gasCostInHex.toFixed(2)} HEX</span></p>
      <p><strong>End-stake Fee as a % of Yield: </strong> <span>{hexGas.feePercentOfYield.toFixed(2)}%</span></p>
      <p><strong>Solo APY:</strong> <span>{soloStats.hexApy.toFixed(1)}%</span></p>
      
      <div className="spacer"></div>
      <h2 className="bold-text" id="header1">
        <span className="underhead">Pool Party Stake</span>
      </h2>
      <p><strong>Total fee:</strong> <span>{poolStats.totalFee.toFixed(2)}%</span></p>
      <p><strong>Total Fee in HEX:</strong> <span>{poolStats.totalFeeInHex.toFixed(0)}</span></p>
      <p><strong>Fee as a % of Yield:</strong> <span>{poolStats.feeAsPercentageOfYield.toFixed(2)}%</span></p>
      <p><strong>T-Shares: </strong> <span>{poolStats.tshares.toFixed(1)}</span></p>
      <p><strong>HEX Yield:</strong> <span>{poolStats.hexYield.toFixed(0)}</span></p>
      <p><strong>ROI:</strong> <span>{poolStats.roi.toFixed(1)}%</span></p>
      <p><strong>Pool APY:</strong> <span>{poolStats.hexApy.toFixed(1)}%</span></p>
      
      <div className="spacer"></div>
      <h2 className="bold-text" id="header1">
        <span className="underhead">Existing Maxi Pooled Stakes</span>
      </h2>
      <p><strong>Ⓜ️ HEX APY:</strong> <span>{poolStats.hexApyMaxi.toFixed(1)}%</span></p>
      <p><strong>🛡️ HEX APY:</strong> <span>{poolStats.hexApyDeci.toFixed(1)}%</span></p>
      <p><strong>🍀 HEX APY:</strong> <span>{poolStats.hexApyLucky.toFixed(1)}%</span></p>
      <p><strong>🎲 HEX APY:</strong> <span>{poolStats.hexApyTrio.toFixed(1)}%</span></p>
      <p><strong>🟠 HEX APY:</strong> <span>{poolStats.hexApyBase.toFixed(1)}%</span></p>
      
      <div className="spacer"></div>
      <p><strong>Ⓜ️ Effective $ APY:</strong> <span>{poolStats.effectiveApyMaxi.toFixed(1)}%</span></p>
      <p><strong>🛡️ Effective $ APY:</strong> <span>{poolStats.effectiveApyDeci.toFixed(1)}%</span></p>
      <p><strong>🍀 Effective $ APY:</strong> <span>{poolStats.effectiveApyLucky.toFixed(1)}%</span></p>
      <p><strong>🎲 Effective $ APY:</strong> <span>{poolStats.effectiveApyTrio.toFixed(1)}%</span></p>
      <p><strong>🟠 Effective $ APY:</strong> <span>{poolStats.effectiveApyBase.toFixed(1)}%</span></p>

      <div className="spacer"></div>
      <p className="notey">
        *APY stats take into account all fees (Pool Party platform fee & PLS end-stake gas fee)
      </p>
      <div className="spacer"></div>
      <p className="notey">
        *Effective $ APY is the resulting HEX APY you would get from a pooled HEX stake by buying it at its current premium/discount
      </p>
    </div>
  );
}

export default PoolStats;