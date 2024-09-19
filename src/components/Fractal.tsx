// src/components/Fractal.tsx
import React, { forwardRef, ReactElement } from 'react';

interface FractalProps {
  density: number; // Controls the density of circles in each ring
  numRings: number; // Controls how many rings are drawn
  startColor: string; // Starting color for the gradient
  middleColor: string; // Middle color for the gradient
  endColor: string; // Ending color for the gradient
  spinFactor: number; // Controls the spinning effect strength
  spacingFactor: number; // Controls the nonlinear spacing between rings
  randomnessFactor: number; // Controls the amount of randomness in circle sizes
  glueEffect: boolean; // Enables or disables the gluey effect
  shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon'; // The shape to draw
}

const Fractal = forwardRef<SVGSVGElement, FractalProps>(
  ({ density, numRings, startColor, middleColor, endColor, spinFactor, spacingFactor, randomnessFactor, glueEffect, shape }, ref) => {
    const width = 600;
    const height = 600;
    const margin = 40; // Margin around the fractal
    const centerX = width / 2;
    const centerY = height / 2;
    const initialRadius = 30; // Base size of the shapes in the first ring
    const maxRadius = (Math.min(width, height) - 2 * margin) / 2; // Max distance for outermost rings
    const totalRings = numRings; // Set the number of rings dynamically

    const elements: JSX.Element[] = [];

    // Helper function to interpolate between three colors
    const interpolateColor = (start: string, middle: string, end: string, factor: number): string => {
      const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
      };

      const rgbToHex = (rgb: number[]) => {
        return '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
      };

      let startRgb, endRgb;
      if (factor <= 0.5) {
        startRgb = hexToRgb(start);
        endRgb = hexToRgb(middle);
        factor = factor * 2; // Adjust factor for first half of the interpolation
      } else {
        startRgb = hexToRgb(middle);
        endRgb = hexToRgb(end);
        factor = (factor - 0.5) * 2; // Adjust factor for second half of the interpolation
      }

      const interpolatedRgb = startRgb.map((startValue, i) => {
        return Math.round(startValue + (endRgb[i] - startValue) * factor);
      });

      return rgbToHex(interpolatedRgb);
    };

    // Function to calculate the evolving reduction factor
    const calculateReductionFactor = (ringIndex: number): number => {
      const minFactor = 0.7;
      const maxFactor = 1.0;
      // Nonlinear evolution of reduction factor: Decays over rings
      return maxFactor - (maxFactor - minFactor) * Math.pow(ringIndex / totalRings, 2); // Quadratic decay
    };

    // Function to calculate ring spacing
    const calculateRingDistance = (ringIndex: number) => {
      const relativePosition = ringIndex / totalRings;
      const scalingFactor = spacingFactor * maxRadius;
      return scalingFactor * Math.pow(relativePosition, 0.6);
    };

    // Function to apply a galaxy-like spin effect
    const calculateSpinOffset = (ringIndex: number) => {
      return ringIndex * spinFactor * 0.5;
    };

    // Function to add some randomness to shape sizes
    const randomizeShapeSize = (size: number, variance: number) => {
      const randomFactor = 1 + (Math.random() * variance - variance / 2);
      return size * randomFactor;
    };

    // Function to draw different shapes
    const drawShape = (x: number, y: number, size: number, color: string, shape: string): ReactElement | null => {
      switch (shape) {
        case 'circle':
          return (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={size / 2} fill={color} stroke="none" />
          );
        case 'square':
          return (
            <rect
              key={`${x}-${y}`}
              x={x - size / 2}
              y={y - size / 2}
              width={size}
              height={size}
              fill={color}
              stroke="none"
            />
          );
        case 'triangle':
          return (
            <polygon
              key={`${x}-${y}`}
              points={`${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${x + size / 2},${y + size / 2}`}
              fill={color}
              stroke="none"
            />
          );
        case 'diamond':
          return (
            <polygon
              key={`${x}-${y}`}
              points={`${x},${y - size / 2} ${x - size / 2},${y} ${x},${y + size / 2} ${x + size / 2},${y}`}
              fill={color}
              stroke="none"
            />
          );
          case 'hexagon': {
            // Wrapped in block to avoid lexical declaration error
            const angle = (Math.PI * 2) / 6;
            const hexPoints = Array.from({ length: 6 }).map((_, i) => {
              const dx = (size / 2) * Math.cos(angle * i);
              const dy = (size / 2) * Math.sin(angle * i);
              return `${x + dx},${y + dy}`;
            });
            return (
              <polygon
                key={`${x}-${y}`}
                points={hexPoints.join(' ')}
                fill={color}
                stroke="none"
              />
            );
          }
        default:
          return null;
      }
    };

    // Draw a central shape
    const centralShapeSize = initialRadius * 1.4;
    elements.push(drawShape(centerX, centerY, centralShapeSize, startColor, shape)!); // Ensure ReactElement with "!"

    // Recursive function to generate concentric rings of shapes
    const drawRing = (ringIndex: number) => {
      const numCircles = Math.max(4, ringIndex * density); // Ensure at least 4 shapes in the first ring
      const evolvingReductionFactor = calculateReductionFactor(ringIndex); // Evolving reduction factor
      const baseSize = initialRadius * Math.pow(evolvingReductionFactor, ringIndex); // Shrink shapes progressively based on evolving reduction factor
      const ringDistance = calculateRingDistance(ringIndex);
      const spinOffset = calculateSpinOffset(ringIndex);

      const ringColor = interpolateColor(startColor, middleColor, endColor, ringIndex / totalRings); // Interpolate color

      for (let i = 0; i < numCircles; i++) {
        const angle = (2 * Math.PI * i) / numCircles + spinOffset;
        const x = centerX + ringDistance * Math.cos(angle);
        const y = centerY + ringDistance * Math.sin(angle);
        const randomSize = randomizeShapeSize(baseSize, randomnessFactor);

        elements.push(drawShape(x, y, randomSize, ringColor, shape)!); // Ensure ReactElement with "!"
      }
    };

    // Apply gluey effect if enabled
    const filter = glueEffect ? (
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
            1 0 0 0 0  
            0 1 0 0 0  
            0 0 1 0 0  
            0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    ) : null;

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
        {filter}
        <g filter={glueEffect ? 'url(#goo)' : ''}>
          {elements}
        </g>
      </svg>
    );
  }
);

Fractal.displayName = 'Fractal';

export default Fractal;