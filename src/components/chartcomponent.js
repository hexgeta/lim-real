import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const data = [
  { day: 881, discount: 1.0, backingValue: 1.0 },
  { day: 997, discount: 2.0, backingValue: 1.1 },
  { day: 1113, discount: 1.5, backingValue: 1.2 },
  { day: 1229, discount: 1.3, backingValue: 1.3 },
  { day: 1345, discount: 1.4, backingValue: 1.4 },
  { day: 1461, discount: 1.5, backingValue: 1.5 },
  { day: 1577, discount: 1.2, backingValue: 1.6 },
  { day: 1693, discount: 1.3, backingValue: 1.7 },
  // Add more data points as needed to match the chart
];

const DiscountChart = () => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2 style={{ textAlign: 'center' }}>pMaxi <span style={{ color: 'blue' }}>Ⓜ️</span></h2>
      <LineChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" label={{ value: 'Day Number', position: 'insideBottomRight', offset: -10 }} />
        <YAxis domain={[0, 2.5]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="discount" stroke="#ff0000" dot={false} name="Δ Discount/Premium in HEX" />
        <Line type="monotone" dataKey="backingValue" stroke="#ffa500" dot={false} name="Backing Value (Principle + Yield)" />
        <ReferenceLine x={1229} stroke="purple" label={{ value: 'PulseChain launch', angle: 90, position: 'insideTopLeft' }} />
      </LineChart>
    </div>
  );
};

export default DiscountChart;