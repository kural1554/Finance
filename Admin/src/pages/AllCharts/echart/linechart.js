import React, { Component } from "react"
import ReactEcharts from "echarts-for-react"

class Line extends Component {
  getOption = () => {
    return {
      tooltip: {
        trigger: "axis",
      },
      grid: {
        zlevel: 0,
        x: 50,
        x2: 50,
        y: 30,
        y2: 30,
        borderWidth: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)',
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLable: {
          color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#858d98",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLable: {
          color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#858d98",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(133, 141, 152, 0.1)"
          }
        }
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
        },
      ],
      color: ["#2ab57d", "#ccc"],
      // textStyle: {
      //   color: ["#858d98"],
      // },
    };
  };
  render() {
    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "350px" }} option={this.getOption()} />
      </React.Fragment>
    )
  }
}
export default Line
