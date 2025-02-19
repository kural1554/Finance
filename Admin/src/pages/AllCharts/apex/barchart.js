import React from 'react'
import ReactApexChart from "react-apexcharts"

const barchart = () => {
  const series = [
    {
      data: [380, 430, 450, 475, 550, 584, 780, 1100, 1220, 1365],
    },
  ]
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },

    colors: ["#2ab57d"],
    grid: {
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories: [
        "South Korea",
        "Canada",
        "United Kingdom",
        "Netherlands",
        "Italy",
        "France",
        "Japan",
        "United States",
        "China",
        "Germany",
      ],
    },
  }

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={series} type="bar" height="350" className="apex-charts" />
    </React.Fragment>
  )
}

export default barchart