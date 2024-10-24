import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

// Simulated tax data (replace this with actual data loaded from a JSON file)
const taxRules = {
  "UK 2023-24": {
    "income tax": [
      { "threshold": 12570, "rate": 0 },
      { "threshold": 50270, "rate": 0.2 },
      { "threshold": 125140, "rate": 0.4 },
      { "rate": 0.45 }
    ],
    "NI": [
      { "threshold": 12570, "rate": 0 },
      { "threshold": 50270, "rate": 0.12 },
      { "rate": 0.02 }
    ],
    "allowance withdrawal threshold": 100000,
    "allowance withdrawal rate": 0.5,
    "statutory personal allowance": 12570
  }
};

const STUDENT_LOAN_RATE = 0.09;
const STUDENT_LOAN_THRESHOLD = 27295;

interface TaxData {
  grossIncome: number;
  marginalRate: number;
  effectiveRate: number;
  netIncome: number;
}

const UKMarginalTaxRateChart: React.FC = () => {
  const [data, setData] = useState<TaxData[]>([]);

  const calculateTax = (grossIncome: number, rules: any, includeStudentLoan: boolean = false) => {
    let totalTax = 0;
    let taxableIncome = grossIncome;

    // Personal Allowance withdrawal
    if (grossIncome > rules["allowance withdrawal threshold"]) {
      const reduction = Math.min(
        rules["statutory personal allowance"],
        (grossIncome - rules["allowance withdrawal threshold"]) * rules["allowance withdrawal rate"]
      );
      taxableIncome += reduction;
    }

    // Income Tax
    let lastThreshold = 0;
    for (const band of rules["income tax"]) {
      const threshold = band.threshold || Infinity;
      const amountInBand = Math.min(taxableIncome, threshold) - lastThreshold;
      totalTax += amountInBand * band.rate;
      if (taxableIncome <= threshold) break;
      lastThreshold = threshold;
    }

    // National Insurance
    lastThreshold = 0;
    for (const band of rules["NI"]) {
      const threshold = band.threshold || Infinity;
      const amountInBand = Math.min(grossIncome, threshold) - lastThreshold;
      totalTax += amountInBand * band.rate;
      if (grossIncome <= threshold) break;
      lastThreshold = threshold;
    }

    // Student Loan
    if (includeStudentLoan && grossIncome > STUDENT_LOAN_THRESHOLD) {
      totalTax += (grossIncome - STUDENT_LOAN_THRESHOLD) * STUDENT_LOAN_RATE;
    }

    const netIncome = grossIncome - totalTax;
    const effectiveRate = (totalTax / grossIncome) * 100;

    return { totalTax, netIncome, effectiveRate };
  };

  useEffect(() => {
    const generateData = () => {
      const newData: TaxData[] = [];
      const rules = taxRules["UK 2023-24"];
      const maxIncome = 200000;
      const step = 1000;

      for (let grossIncome = 0; grossIncome <= maxIncome; grossIncome += step) {
        const { totalTax, netIncome, effectiveRate } = calculateTax(grossIncome, rules);
        const prevTotalTax = grossIncome > 0 ? calculateTax(grossIncome - step, rules).totalTax : 0;
        const marginalRate = ((totalTax - prevTotalTax) / step) * 100;

        newData.push({
          grossIncome,
          marginalRate,
          effectiveRate,
          netIncome
        });
      }

      setData(newData);
    };

    generateData();
  }, []);

  const maxRate = useMemo(() => {
    return Math.max(...data.map(item => Math.max(item.marginalRate, item.effectiveRate))) + 10;
  }, [data]);

  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          border: 'solid 1px #fff', 
          borderRadius: '5px',
          padding: '10px',
          color: 'white'
        }}>
          <p>Gross Income: {formatCurrency(label)}</p>
          <p>Marginal Rate: {formatPercentage(payload[0].value)}</p>
          <p>Effective Rate: {formatPercentage(payload[1].value)}</p>
          <p>Net Income: {formatCurrency(payload[2].payload.netIncome)}</p>
        </div>
      );
    }
    return null;
  };

  const scaledData = useMemo(() => {
    if (data.length === 0) return [];
    const maxNetIncome = Math.max(...data.map(d => d.netIncome));
    return data.map(d => ({
      ...d,
      scaledNetIncome: (d.netIncome / maxNetIncome) * 100 // Scale net income to 0-100 range
    }));
  }, [data]);

  return (
    <div style={{ width: '100%', height: '450px', backgroundColor: '#000', padding: '0px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={scaledData}
          margin={{ top: 10, right: 50, left: 0, bottom: 0 }}
        >
          <XAxis 
            dataKey="grossIncome" 
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCurrency}
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <YAxis 
            stroke="#888" 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine y={20} stroke="#888" strokeDasharray="3 3" />
          <ReferenceLine y={40} stroke="#888" strokeDasharray="3 3" />
          <ReferenceLine y={60} stroke="#888" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="marginalRate" 
            name="Marginal Rate"
            stroke="#FFFFFF" 
            dot={false} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="effectiveRate" 
            name="Effective Rate"
            stroke="#FF5733" 
            dot={false} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="scaledNetIncome" 
            name="Net Income"
            stroke="#33FF57" 
            dot={false} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UKMarginalTaxRateChart;
