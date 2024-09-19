// src/App.tsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Fractal from './components/Fractal';

const App: React.FC = () => {
  const [density, setDensity] = useState<number>(4);
  const [numRings, setNumRings] = useState<number>(5);
  const [startColor, setStartColor] = useState<string>('#ff3333');
  const [middleColor, setMiddleColor] = useState<string>('#ffbf00');
  const [endColor, setEndColor] = useState<string>('#ff3467');
  const [spinFactor, setSpinFactor] = useState<number>(0.4);
  const [spacingFactor, setSpacingFactor] = useState<number>(0.5);
  const [randomnessFactor, setRandomnessFactor] = useState<number>(0.2);
  const [glueEffect, setGlueEffect] = useState<boolean>(false); // Glue effect toggle
  const [gooStrength, setGooStrength] = useState<number>(10); // Goo effect strength
  const [shape, setShape] = useState<'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon'>('circle'); // Shape selector

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
      <h1>Fractal Shape Generator</h1>
      <Controls>
        {/* Shape Selector */}
        <label htmlFor="shape">Shape:</label>
        <select
          id="shape"
          value={shape}
          onChange={(e) => setShape(e.target.value as 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon')}
        >
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
          <option value="diamond">Diamond</option>
          <option value="hexagon">Hexagon</option>
        </select>
        <br />
        <br />
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
        <label htmlFor="glueEffect">Gluey Effect:</label>
        <input
          type="checkbox"
          id="glueEffect"
          checked={glueEffect}
          onChange={(e) => setGlueEffect(e.target.checked)}
        />
        <br />
        <br />
        {glueEffect && (
          <>
            <label htmlFor="gooStrength">Glue Effect Strength:</label>
            <input
              type="range"
              id="gooStrength"
              name="gooStrength"
              min="0"
              max="20"
              step="0.1"
              value={gooStrength}
              onChange={(e) => setGooStrength(parseFloat(e.target.value))}
            />
            <br />
            <br />
          </>
        )}
        <label htmlFor="startColor">Start Color:</label>
        <input
          type="color"
          id="startColor"
          value={startColor}
          onChange={(e) => setStartColor(e.target.value)}
        />
        <label htmlFor="middleColor">Middle Color:</label>
        <input
          type="color"
          id="middleColor"
          value={middleColor}
          onChange={(e) => setMiddleColor(e.target.value)}
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
        middleColor={middleColor}
        endColor={endColor}
        spinFactor={spinFactor}
        spacingFactor={spacingFactor}
        randomnessFactor={randomnessFactor}
        glueEffect={glueEffect}
        shape={shape} // Pass the selected shape
        ref={svgRef}
      />
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Controls = styled.div`
  margin-top: 20px;
`;
