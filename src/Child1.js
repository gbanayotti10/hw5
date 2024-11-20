import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  state = {
    company: "Apple", // Default company
    selectedMonth: "November", // Default month
  };

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.csv_data !== this.props.csv_data ||
      prevState.company !== this.state.company ||
      prevState.selectedMonth !== this.state.selectedMonth
    ) {
      this.renderChart();
    }
  }

  handleCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  };

  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  renderChart() {
    const { csv_data } = this.props;
    const { company, selectedMonth } = this.state;

    const filteredData = csv_data.filter((d) => {
      const monthName = d.Date.toLocaleString("default", { month: "long" });
      return d.Company === company && monthName === selectedMonth;
    });

    d3.select("#chart").selectAll("*").remove();

    const margin = { top: 30, right: 150, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.Date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => Math.min(d.Open, d.Close)),
        d3.max(filteredData, (d) => Math.max(d.Open, d.Close)),
      ])
      .nice()
      .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-45)");

    svg.append("g").call(d3.axisLeft(yScale));

    const lineOpen = d3
      .line()
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.Open))
      .curve(d3.curveMonotoneX);

    const lineClose = d3
      .line()
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.Close))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 2)
      .attr("d", lineOpen);

    svg.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 2)
      .attr("d", lineClose);

    svg.selectAll(".dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Date))
      .attr("cy", (d) => yScale(d.Open))
      .attr("r", 4)
      .attr("fill", "#b2df8a");

    svg.selectAll(".dot-close")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Date))
      .attr("cy", (d) => yScale(d.Close))
      .attr("r", 4)
      .attr("fill", "#e41a1c");

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20}, 10)`);

    const legendData = [
      { color: "#b2df8a", label: "Open" },
      { color: "#e41a1c", label: "Close" },
    ];

    legend
      .selectAll("g")
      .data(legendData)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`)
      .each(function (d) {
        d3.select(this)
          .append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", d.color);

        d3.select(this)
          .append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text(d.label)
          .style("font-size", "14px")
          .style("alignment-baseline", "middle");
      });
  }

  render() {
    const options = ["Apple", "Microsoft", "Amazon", "Google", "Meta"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="child1">
        <div className="filter-container">
          <div className="company-filter">
            <span>Company:</span>
            {options.map((company) => (
              <label key={company}>
                <input
                  type="radio"
                  value={company}
                  checked={this.state.company === company}
                  onChange={this.handleCompanyChange}
                />
                {company}
              </label>
            ))}
          </div>
          <div className="month-filter">
            <span>Month:</span>
            <select
              value={this.state.selectedMonth}
              onChange={this.handleMonthChange}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id="chart" className="chart"></div>
      </div>
    );
  }
}

export default Child1;
