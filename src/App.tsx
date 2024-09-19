// src/App.tsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Fractal from './components/Fractal';

const AppContainer = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Controls = styled.div`
  margin-top: 20px;
`;

const App: React.FC = () => {
  const [density, setDensity] = useState<number>(4);
  const [numRings, setNumRings] = useState<number>(5);
  const [startColor, setStartColor] = useState<string>('#FF5733'); // Start color
  const [endColor, setEndColor] = useState<string>('#3357FF'); // End color
  const [spinFactor, setSpinFactor] = useState<number>(0.4);
  const [spacingFactor, setSpacingFactor] = useState<number>(0.5);
  const [randomnessFactor, setRandomnessFactor] = useState<number>(0.2);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const saveSVG = () => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);

      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'fractal.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('SVG element not found');
    }
  };

  return (
    <AppContainer>
      <h1>Fractal Circle Generator</h1>
      <Controls>
        <label htmlFor="density">Density:</label>
        <input
          type="range"
          id="density"
          name="density"
          min="1"
          max="7"
          value={density}
          onChange={(e) => setDensity(parseInt(e.target.value, 10))}
        />
        <br />
        <br />
        <label htmlFor="rings">Number of Rings:</label>
        <input
          type="range"
          id="rings"
          name="rings"
          min="3"
          max="12"
          value={numRings}
          onChange={(e) => setNumRings(parseInt(e.target.value, 10))}
        />
        <br />
        <br />
        <label htmlFor="spin">Spin Strength:</label>
        <input
          type="range"
          id="spin"
          name="spin"
          min="0"
          max="1"
          step="0.01"
          value={spinFactor}
          onChange={(e) => setSpinFactor(parseFloat(e.target.value))}
        />
        <br />
        <br />
        <label htmlFor="spacing">Spacing Factor:</label>
        <input
          type="range"
          id="spacing"
          name="spacing"
          min="0.1"
          max="1"
          step="0.01"
          value={spacingFactor}
          onChange={(e) => setSpacingFactor(parseFloat(e.target.value))}
        />
        <br />
        <br />
        <label htmlFor="randomness">Circle Size Randomness:</label>
        <input
          type="range"
          id="randomness"
          name="randomness"
          min="0"
          max="1"
          step="0.01"
          value={randomnessFactor}
          onChange={(e) => setRandomnessFactor(parseFloat(e.target.value))}
        />
        <br />
        <br />
        <label htmlFor="startColor">Start Color:</label>
        <input
          type="color"
          id="startColor"
          value={startColor}
          onChange={(e) => setStartColor(e.target.value)}
        />
        <label htmlFor="endColor">End Color:</label>
        <input
          type="color"
          id="endColor"
          value={endColor}
          onChange={(e) => setEndColor(e.target.value)}
        />
        <br />
        <br />
        <button type="button" onClick={saveSVG}>
          Save SVG
        </button>
      </Controls>
      <Fractal
        density={density}
        numRings={numRings}
        startColor={startColor}
        endColor={endColor}
        spinFactor={spinFactor}
        spacingFactor={spacingFactor}
        randomnessFactor={randomnessFactor}
        ref={svgRef}
      />
    </AppContainer>
  );
};

export default App;