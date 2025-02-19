import React, { Component } from "react"
import ReactEcharts from "echarts-for-react"

class Doughnut extends Component {
  getOption = () => {
    return {
      toolbox: {
        show: !1,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        x: "left",
        data: ["Laptop", "Tablet", "Mobile", "Others", "Desktop"],
        // textStyle: {
        //   color: ["#858d98"],
        // },
      },
      color: ['#5156be', '#ffbf53', '#fd625e', '#4ba6ef', '#2ab57d'],
      series: [
        {
          name: "Total sales",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: !1,
          label: {
            normal: {
              show: !1,
              position: "center",
            },
            emphasis: {
              show: !0,
              textStyle: {
                fontSize: "30",
                fontWeight: "bold",
              },
            },
          },
          labelLine: {
            normal: {
              show: !1,
            },
          },
          data: [
            { value: 335, name: "Laptop" },
            { value: 310, name: "Tablet" },
            { value: 234, name: "Mobile" },
            { value: 135, name: "Others" },
            { value: 1548, name: "Desktop" },
          ],
        },
      ],
    }
  }
  render() {
    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "350px" }} option={this.getOption()} />
      </React.Fragment>
    )
  }
}
export default Doughnut
