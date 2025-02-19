import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const GaugeChart = () => {
  const [chartOption, setChartOption] = useState({

    tooltip: {
      formatter: "{a} <br/>{b} : {c}%",
    },
    toolbox: {
      feature: {
        restore: { title: "Refresh" },
        saveAsImage: { title: "Download Image" }
      },
    },
    series: [
      {
        type: 'gauge',
        detail: { formatter: '{value}%' },
        data: [{ value: 50, name: 'Completion Rate' }],
        axisLabel: { show: true, distance: 15 },
        axisLine: {
          lineStyle: {
            color: [
              [0.2, "#2ab57d"],
              [0.8, "#5156be"],
              [1, "#fd625e"],
            ],
            width: 20,
          },
        },
        pointer: { width: 5 },
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = parseFloat((Math.random() * 100).toFixed(2));
      const newOption = { ...chartOption };
      newOption.series[0].data[0].value = newValue;
      setChartOption(newOption);
    }, 5000);

    return () => clearInterval(interval);
  }, [chartOption]);

  return (
    <ReactECharts
      option={chartOption}
      style={{ height: '350px' }}
    />
  );
};

export default GaugeChart;