import React from "react"
import ReactApexChart from "react-apexcharts"

const PieChart = () => {
  const series = [44, 55, 41, 17, 15]
  const options = {
    labels: ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5"],
    colors: ["#2ab57d", "#5156be", "#fd625e", "#4ba6ef", "#ffbf53"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      verticalAlign: "middle",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
      offsetY: 4,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  return (
    <ReactApexChart options={options} series={series} type="pie" height="320" className="apex-charts" />
  )
}

export default PieChart
