import React, { useEffect, useRef } from 'react';
import { Liquid } from '@antv/g2plot';
import './index.css';

interface LiquidChartProps {
  value: number; // Show the actual value
  max: number; // Maximum value
}

// LiquidChart component to display the liquid chart about the booking details
const LiquidChart: React.FC<LiquidChartProps> = ({ value, max }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const liquidPlot = new Liquid(containerRef.current, {
      percent: value / max, // Calculate the percentage
      statistic: {
        title: false,
        content: {
          formatter: () => `${value}`, // Show the actual value
        },
      },
      outline: {
        border: 4,
        distance: 8,
      },
      wave: { length: 1024 },
    });

    liquidPlot.render();

    return () => {
      liquidPlot.destroy();
    };
  }, [value, max]);

  return <div ref={containerRef} className="liquid-chart-container"></div>;
};

export default LiquidChart;
