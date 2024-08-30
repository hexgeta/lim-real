import React, { useEffect, useRef } from 'react';

function SliderGroup({ stakeLength, organiserFee, onStakeLengthChange, onOrganiserFeeChange }) {
  const stakeLengthRef = useRef(null);
  const organiserFeeRef = useRef(null);

  useEffect(() => {
    updateSliderLabel(stakeLengthRef.current, stakeLength);
    updateSliderLabel(organiserFeeRef.current, organiserFee);
  }, [stakeLength, organiserFee]);

  const updateSliderLabel = (slider, value) => {
    if (slider) {
      const label = slider.nextElementSibling;
      const percent = (value - slider.min) / (slider.max - slider.min);
      const labelPosition = percent * (slider.offsetWidth - 25) + 'px';
      label.style.left = labelPosition;
    }
  };

  return (
    <>
      <div className="slider-group">
        <label htmlFor="stake-length">Stake length in days:</label>
        <div className="slider-container">
          <input
            ref={stakeLengthRef}
            type="range"
            id="stake-length"
            className="slider blue-slider"
            min="1"
            max="5555"
            value={stakeLength}
            onChange={(e) => {
              const value = Number(e.target.value);
              onStakeLengthChange(value);
              updateSliderLabel(e.target, value);
            }}
          />
          <span className="slider-label">{stakeLength}d</span>
        </div>
      </div>
      <div className="slider-group">
        <label htmlFor="organiser-fee">Your organiser fee:</label>
        <div className="slider-container">
          <input
            ref={organiserFeeRef}
            type="range"
            id="organiser-fee"
            className="slider pink-slider"
            min="0"
            max="5"
            step="0.1"
            value={organiserFee}
            onChange={(e) => {
              const value = Number(e.target.value);
              onOrganiserFeeChange(value);
              updateSliderLabel(e.target, value);
            }}
          />
          <span className="slider-label">{organiserFee}%</span>
        </div>
      </div>
    </>
  );
}

export default SliderGroup;