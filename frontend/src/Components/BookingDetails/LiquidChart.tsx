import React, { useEffect, useRef } from 'react';
import { Liquid } from '@antv/g2plot';
import './index.css';

interface LiquidChartProps {
  value: number; // 显示的数值
  max: number; // 最大值，用于计算百分比
}

const LiquidChart: React.FC<LiquidChartProps> = ({ value, max }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const liquidPlot = new Liquid(containerRef.current, {
      percent: value / max, // 计算百分比
      statistic: {
        title: false,
        content: {
          formatter: () => `${value}`, // 直接显示数值
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
