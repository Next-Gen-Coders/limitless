import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartData {
  token0?: string;
  token1?: string;
  chainId?: number;
  seconds?: number;
  candles: CandleData[];
}

interface CandlestickChartProps {
  data?: ChartData;
  width?: number;
  height?: number;
}

const CandlestickChart = ({
  data,
  width = 800,
  height = 400,
}: CandlestickChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !data.candles || data.candles.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse data
    const candles = data.candles.map((d: CandleData) => ({
      ...d,
      date: new Date(d.timestamp * 1000),
    }));

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(candles.map((d) => d.timestamp.toString()))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(candles, (d) => d.low) || 0,
        d3.max(candles, (d) => d.high) || 0,
      ])
      .nice()
      .range([innerHeight, 0]);

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((d) => {
        const timestamp = parseInt(d);
        const date = new Date(timestamp * 1000);
        return d3.timeFormat("%m/%d %H:%M")(date);
      })
      .ticks(Math.min(candles.length, 10));

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(8);
    g.append("g").call(yAxis);

    // Add grid lines
    g.selectAll(".grid-line-x")
      .data(yScale.ticks(8))
      .enter()
      .append("line")
      .attr("class", "grid-line-x")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5);

    // Candlesticks
    const candleGroups = g
      .selectAll(".candle")
      .data(candles)
      .enter()
      .append("g")
      .attr("class", "candle")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.timestamp.toString())},0)`
      );

    // High-Low lines (wicks)
    candleGroups
      .append("line")
      .attr("class", "wick")
      .attr("x1", xScale.bandwidth() / 2)
      .attr("x2", xScale.bandwidth() / 2)
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low))
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    // Candle bodies
    candleGroups
      .append("rect")
      .attr("class", "candle-body")
      .attr("x", 0)
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)) || 1)
      .attr("fill", (d) => (d.close >= d.open ? "#4caf50" : "#f44336"))
      .attr("stroke", (d) => (d.close >= d.open ? "#2e7d32" : "#c62828"))
      .attr("stroke-width", 1);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    candleGroups
      .on("mouseover", (_event, d) => {
        tooltip.style("visibility", "visible").html(
          `
            <strong>Date:</strong> ${d.date.toLocaleString()}<br/>
            <strong>Open:</strong> $${d.open.toFixed(2)}<br/>
            <strong>High:</strong> $${d.high.toFixed(2)}<br/>
            <strong>Low:</strong> $${d.low.toFixed(2)}<br/>
            <strong>Close:</strong> $${d.close.toFixed(2)}<br/>
            <strong>Volume:</strong> ${d.volume.toLocaleString()}
            `
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Cleanup tooltip on unmount
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [data, width, height]);

  return (
    <div className="candlestick-chart">
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        {data?.token0 && data?.token1
          ? `${data.token0}/${data.token1}`
          : "Price Chart"}{" "}
        - Candlestick Chart
      </h3>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: "1px solid #ddd", borderRadius: "5px" }}
      />
    </div>
  );
};

export default CandlestickChart;
