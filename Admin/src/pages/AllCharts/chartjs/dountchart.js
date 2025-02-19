import React from "react"
import { Doughnut } from "react-chartjs-2"

import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';

Chart.register(CategoryScale);

const DountChart = () => {
  const data = {
    labels: ["Desktops", "Tablets"],
    datasets: [
      {
        data: [300, 210],
        backgroundColor: ["#5156be", "#ebeff2"],
        hoverBackgroundColor: ["#5156be", "#ebeff2"],
        hoverBorderColor: "#fff",
      },
    ],
  }

  return <Doughnut width={755} height={320} data={data} options={{ maintainAspectRatio: false }} />
}

export default DountChart
