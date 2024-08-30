import React from 'react';

function InputGroup({ value, onChange }) {
  return (
    <div className="input-group">
      <label htmlFor="raised-hex">Estimated raised HEX</label>
      <input
        type="number"
        id="raised-hex"
        placeholder="e.g. 100,000"
        value={value}
        min="0"
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default InputGroup;