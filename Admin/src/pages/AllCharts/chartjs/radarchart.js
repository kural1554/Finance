import React from "react"
import { Radar } from "react-chartjs-2"

import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';

Chart.register(CategoryScale);

const RadarChart = () => {
  const data = {
    labels: [
      "Eating",
      "Drinking",
      "Sleeping",
      "Designing",
      "Coding",
      "Cycling",
      "Running",
    ],
    datasets: [
      {
        label: "Desktops",
        backgroundColor: "rgba(42, 181, 125, 0.2)",
        borderColor: "#2ab57d",
        pointBackgroundColor: "#2ab57d",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#2ab57d",
        data: [65, 59, 90, 81, 56, 55, 40],
      },
      {
        label: "Tablets",
        backgroundColor: "rgba(81, 86, 190, 0.2)",
        borderColor: "#5156be",
        pointBackgroundColor: "#5156be",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#5156be",
        data: [28, 48, 40, 19, 96, 27, 100],
      },
    ],
  }

  return <Radar width={755} height={320} data={data} options={{ maintainAspectRatio: false }} />
}

export default RadarChart
