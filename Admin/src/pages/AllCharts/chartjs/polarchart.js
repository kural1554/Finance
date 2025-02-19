import React from "react"
import { PolarArea } from "react-chartjs-2"
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const PolarChart = () => {
  const data = {
    datasets: [
      {
        data: [11, 16, 7, 18],
        backgroundColor: ["#fd625e", "#2ab57d", "#ffbf53", "#5156be"],
        label: "My dataset", // for legend
        hoverBorderColor: "#fff",
      },
    ],
    labels: ["Series 1", "Series 2", "Series 3", "Series 4"],
  }

  return <PolarArea width={755} height={320} data={data} options={{ maintainAspectRatio: false }} />
}

export default PolarChart
