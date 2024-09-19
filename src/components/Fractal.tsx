// src/components/Fractal.tsx
import React, { forwardRef } from 'react';

interface FractalProps {
  density: number; // Controls the density of circles in each ring
  numRings: number; // Controls how many rings are drawn
  startColor: string; // Starting color for the gradient
  endColor: string; // Ending color for the gradient
  spinFactor: number; // Controls the spinning effect strength
  spacingFactor: number; // Controls the nonlinear spacing between rings
  randomnessFactor: number; // Controls the amount of randomness in circle sizes
}

const Fractal = forwardRef<SVGSVGElement, FractalProps>(({ density, numRings, startColor, endColor, spinFactor, spacingFactor, randomnessFactor }, ref) => {
  const width = 600;
  const height = 600;
  const margin = 40; // Margin around the fractal
  const centerX = width / 2;
  const centerY = height / 2;
  const initialRadius = 30; // Base size of the circles in the first ring
  const maxRadius = (Math.min(width, height) - 2 * margin) / 2; // Max distance for outermost rings
  const reductionFactor = 0.8; // How much the circle size shrinks in each ring
  const totalRings = numRings; // Set the number of rings dynamically

  const elements: JSX.Element[] = [];

  // Helper function to interpolate between two colors
  const interpolateColor = (start: string, end: string, factor: number): string => {
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const rgbToHex = (rgb: number[]) => {
      return '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
    };

    const startRgb = hexToRgb(start);
    const endRgb = hexToRgb(end);

    const interpolatedRgb = startRgb.map((startValue, i) => {
      return Math.round(startValue + (endRgb[i] - startValue) * factor);
    });

    return rgbToHex(interpolatedRgb);
  };

  // Function to calculate ring spacing (more regular, larger inner spacing, no inner ring further than outer ring)
  const calculateRingDistance = (ringIndex: number) => {
    const relativePosition = ringIndex / totalRings;
    const scalingFactor = spacingFactor * maxRadius;
    return scalingFactor * relativePosition; // Linear scaling for more regular spacing
  };

  // Function to apply a galaxy-like spin effect
  const calculateSpinOffset = (ringIndex: number) => {
    return ringIndex * spinFactor * 0.5;
  };

  // Function to add some randomness to circle sizes
  const randomizeCircleSize = (radius: number, variance: number) => {
    const randomFactor = 1 + (Math.random() * variance - variance / 2);
    return radius * randomFactor;
  };

  // Draw a central circle
  const centralCircleRadius = initialRadius * 1.4;
  elements.push(
    <circle
      key="center-circle"
      cx={centerX}
      cy={centerY}
      r={centralCircleRadius}
      fill={startColor}
      stroke="none"
    />
  );

  // Recursive function to generate concentric rings of circles
  const drawRing = (ringIndex: number) => {
    const numCircles = Math.max(4, ringIndex * density); // Ensure at least 4 circles in first ring
    const baseRadius = initialRadius * Math.pow(reductionFactor, ringIndex); // Shrink circles progressively
    const ringDistance = calculateRingDistance(ringIndex);
    const spinOffset = calculateSpinOffset(ringIndex);

    const ringColor = interpolateColor(startColor, endColor, ringIndex / totalRings); // Interpolate color

    for (let i = 0; i < numCircles; i++) {
      const angle = (2 * Math.PI * i) / numCircles + spinOffset;
      const x = centerX + ringDistance * Math.cos(angle);
      const y = centerY + ringDistance * Math.sin(angle);
      const randomRadius = randomizeCircleSize(baseRadius, randomnessFactor);

      elements.push(
        <circle
          key={`circle-${ringIndex}-${i}`}
          cx={x}
          cy={y}
          r={randomRadius}
          fill={ringColor}
          stroke="none"
        />
      );
    }
  };

  // Loop through each ring and draw it
  for (let ringIndex = 0; ringIndex < totalRings; ringIndex++) {
    drawRing(ringIndex);
  }

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      style={{ border: '1px solid #ccc', marginTop: '20px' }}
    >
      {elements}
    </svg>
  );
});

Fractal.displayName = 'Fractal';

export default Fractal;