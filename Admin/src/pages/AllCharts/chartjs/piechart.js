import React from "react"
import { Pie } from "react-chartjs-2"

import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';

Chart.register(CategoryScale);

const PieChart = () => {
  const data = {
    labels: ["Desktops", "Tablets"],
    datasets: [
      {
        data: [300, 180],
        backgroundColor: ["#2ab57d", "#ebeff2"],
        hoverBackgroundColor: ["#2ab57d", "#ebeff2"],
        hoverBorderColor: "#fff",
      },
    ],
  }

  return <Pie width={755} height={320} data={data} options={{ maintainAspectRatio: false }} />
}

export default PieChart
